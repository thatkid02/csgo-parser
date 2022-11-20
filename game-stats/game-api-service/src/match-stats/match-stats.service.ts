/** Nest and Other NPM Packages **/
import { Injectable, Req, Res, HttpStatus } from "@nestjs/common";
import * as fs from 'fs';
import { AllPatterns, mapped, MetaData, Player, PlayerBombDefusedPattern, PlayerKillPattern, PlayerKillScore, RoundInfo, RoundScorePattern, TeamPlayingPattern, TeamScore, WorldRoundEndPattern, WorldRoundStartPattern } from "./match-stats.types";
const execSync = require('child_process').execSync;

/** Service module imports **/
import { MatchStatsWriteDal } from "./match-stats.write.dal";

@Injectable()
export class MatchStatsService {
    #file;
    #logger;
    #logData: string[];
    #players: Player[];
    #killedLogData: any[] = [];
    #roundLogData: RoundInfo[] = [];
    #KillingSpreePlayer = ""
    #MaxBombDiffusePlayer = ""
    #LongestRound = ""
    #VersatilePlayer = ""
    #teamSide;

    private readonly csgoLogPattern = new RegExp(/(\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}): (.*)/i);

    constructor(
        private readonly matchStatsWrite: MatchStatsWriteDal,
    ) {
        this.#file = fs.readFileSync('./src/resources/gameStart.txt', 'utf8');
        this.#logData = this.#file.split(/\r?\n/);
        this.#logger = fs.createWriteStream('playersInfo.json', {
            // flags: 'a' 
        })
    }


    onModuleInit() {
        this.#players = this.getPlayers();

        this.setPlayerKillLogs();

        this.getKillingSpreePlayer()
        this.getVersatilePlayer()



        this.getAllRoundInfo();
        this.getLongestRound()

        this.setBombDiffusalPlayer()
        this.getDiffusingMvpPlayer()
        this.setRoundScore()
        this.#logger.write(JSON.stringify(this.#roundLogData))

        const plogs = this.setMetaData(this.#logData)

    }

    getDataFromAllLog(res) {
        return res.status(200).header({}).send();
    }

    // WIP to construct mapped regex
    setMetaData(log: string[]): MetaData[] {
        let metaData = [];
        log.forEach(line => {
            const parsedLog = line.split(": ", 2)

            const [matchedPattern, key] = this.getLogAllPatern(parsedLog[1])
            let meta = {}
            if (matchedPattern) {
                meta = { time: new Date(parsedLog[0].replace("-", "")), type: matchedPattern }
                metaData.push(meta)

                //  TODO: Check if match id present then do not insert
                // this.matchStatsWrite.insertGameLogs(
                //     {
                //         matchId: "nels",
                //         rawLog: line,
                //         logTime: new Date(parsedLog[0].replace("-", "")),
                //         logPatternType: key,
                //         logParsedItems: matchedPattern,
                //     }).then(res =>{
                //         console.log(res)
                //     })
                this.#logger.write(JSON.stringify(meta) + "\n")
            }



        });
        return metaData
    }

    private static getType(metaData: MetaData): string {
        return metaData.type;
    }

    private static getTime(metaData: MetaData): Date {
        return metaData.time;
    }

    getLogAllPatern(log) {
        let matchedPattern; let key
        mapped.forEach((pattern, key) => {
            key = key
            const match = pattern.test(log)
            if (match) {
                matchedPattern = pattern.exec(log)
            }
            return false;
        })

        return [matchedPattern, key]

    }
    getLogForPattern(line: string, pattern: RegExp) {
        const log = this.csgoLogPattern.exec(line);

        if (!log) return { message: "no match found" };

        const isLog = pattern.test(line);

        if (isLog) return pattern.exec(line);
    }

    getPlayers(): Player[] {
        this.#players = [{ name: "admin", pId: 0, steamId: "0", side: null, kills: 0, wiki: "" }];

        this.#logData.forEach(line => {
            if (this.#players.length < 12) {
                const parsedLog = this.getLogForPattern(line, PlayerKillPattern);
                if (parsedLog) {
                    this.#killedLogData.push(parsedLog)
                    this.#players.forEach(() => {
                        const found = this.#players.some(player => player.name === parsedLog[1])
                        if (!found) {
                            this.#players.push({ name: parsedLog[1], pId: parsedLog[2], steamId: parsedLog[3], side: null, kills: 0, wiki: "https://liquipedia.net/counterstrike/" + parsedLog[1] })
                        }
                    });
                }
            }
        });
        // Remove admin
        this.#players.shift()
        return this.#players;
    }

    //set diffusal
    setBombDiffusalPlayer() {
        this.#players.forEach(player => {
            player.game.diffusedBombCount = 0;
            this.#logData.forEach(line => {
                const bombLog = this.getLogForPattern(line, PlayerBombDefusedPattern)
                if (bombLog) {
                    if (player.name == bombLog[1]) {
                        player.game.diffusedBombCount = player.game.diffusedBombCount + 1;
                    }
                }
            })
        })
    }

    // set Kill feed
    setPlayerKillLogs(): void {
        let playerKillScore = []

        this.#players.forEach(player => {
            this.#killedLogData.forEach(parsedLog => {
                if (player.name == parsedLog[1]) {
                    // first time it will fail
                    playerKillScore = this.setPlayerStats(playerKillScore, parsedLog)
                    if (playerKillScore.length == 0) {
                        playerKillScore.push({
                            attacker: parsedLog[1],
                            victim: [parsedLog[9]],
                            ctSideScore: parsedLog[4] == "CT" ? 1 : 0,
                            tSideScore: parsedLog[4] == "CT" ? 0 : 1,
                            weapon: [parsedLog[19]]
                        } as PlayerKillScore)
                    }
                }
            });
        });
        this.setPlayerGameStats(playerKillScore);
    }

    // unique log stats
    setPlayerStats(playerKillScore, parsedLog) {
        playerKillScore.push({
            attacker: parsedLog[1],
            victim: parsedLog[9],
            ctSideScore: parsedLog[4] == "CT" ? 1 : 0,
            tSideScore: parsedLog[4] == "CT" ? 0 : 1,
            weapon: parsedLog[16]
        } as PlayerKillScore)
        return playerKillScore
    }

    // constructed player stats
    setPlayerGameStats(playerKillScore) {
        const killerPlayers = []
        this.#players.forEach((player) => {
            player.game = { victims: [], weapons: [], tSideScore: 0, ctSideScore: 0 }
            playerKillScore.forEach(killer => {
                if (player.name == killer.attacker) {
                    player.kills = player.game.ctSideScore + killer.ctSideScore + player.game.tSideScore + killer.tSideScore
                    player.game?.victims.push(killer.victim)
                    player.game?.weapons.push(killer.weapon)
                    player.game.ctSideScore = player.game.ctSideScore + killer.ctSideScore
                    player.game.tSideScore = player.game.tSideScore + killer.tSideScore
                }
            });

            player.game.victims = Array.from((new Set<string>(player.game.victims)).values());
            player.game.weapons = Array.from((new Set<string>(player.game.weapons)).values());
            killerPlayers.push(player)

        });
    }

    getAllRoundInfo() {
        let roundLog: RoundInfo = { roundStartTime: null, roundEndTime: null, roundNumber: 0, duration: 0, team: { ctScore: 0, tScore: 0 } }
        let roundCount = 0;
        this.#logData.forEach((line) => {

            const teamSide = this.getLogForPattern(line, TeamPlayingPattern);
            const startLog = this.getLogForPattern(line, WorldRoundStartPattern);
            const endLog = this.getLogForPattern(line, WorldRoundEndPattern);

            if (teamSide) {
                if (teamSide[1] == "CT") {
                    roundLog.team.ctTeam = teamSide[2]
                } else {
                    roundLog.team.tTeam = teamSide[2]
                }
            }

            if (startLog) {
                roundLog.roundStartTime = new Date(startLog[1].replace("-", "").slice(0, -1));
            }

            if (endLog) {
                roundLog.roundEndTime = new Date(endLog[1].replace("-", "").slice(0, -1));
            }

            if (roundLog.roundStartTime != null && roundLog.roundEndTime != null) {
                roundCount += 1
                this.#roundLogData.push({ ...roundLog, roundNumber: roundCount, duration: Math.round(((roundLog.roundEndTime.valueOf() - roundLog.roundStartTime.valueOf()) + Number.EPSILON) / 1000) })
                roundLog = { roundStartTime: null, roundEndTime: null, roundNumber: 0, duration: 0, team: { ctScore: 0, tScore: 0 } }
            }
        });
    }

    setRoundScore() {
        let map = "";
        this.#roundLogData.forEach((round) => {
            this.#logData.forEach((line) => {
                const roundScore = this.getLogForPattern(line, RoundScorePattern);
                if (roundScore) {
                    if (round.roundNumber == <Number>roundScore[4]) {
                        round.team.ctScore = roundScore[1]
                        round.team.tScore = roundScore[2]
                        round.map = roundScore[3]
                    }
                }
            })

        });
    }

    //  Analysis Starts here
    getVersatilePlayer(): void {
        let maxWeaponCount = 0; let starPlayer = "admin";
        this.#players.forEach(player => {
            starPlayer = player.game.weapons.length > maxWeaponCount ? player.name : starPlayer
            maxWeaponCount = player.game.weapons.length > maxWeaponCount ? player.game.weapons.length : maxWeaponCount
        });
        const versatilePlayer = `Versatile Player: ${starPlayer} has used ${maxWeaponCount} variety of weapons`;
        console.log(versatilePlayer)
        this.#VersatilePlayer = versatilePlayer
    }

    getKillingSpreePlayer(): void {
        let maxKills = 0; let starPlayer = "admin";
        this.#players.forEach(player => {
            starPlayer = player.game.ctSideScore + player.game.tSideScore > maxKills ? player.name : starPlayer
            maxKills = player.game.tSideScore + player.game.ctSideScore > maxKills ? player.game.tSideScore + player.game.ctSideScore : maxKills
        });
        const mvpPlayer = `Killng Spree Player: ${starPlayer} has killed total of ${maxKills}`
        console.log(mvpPlayer)
        this.#KillingSpreePlayer = mvpPlayer
    }

    getDiffusingMvpPlayer() {
        let maxDiffuse = 0; let mvpPlayer = "admin";
        this.#players.forEach(player => {
            mvpPlayer = player.game.diffusedBombCount > maxDiffuse ? player.name : mvpPlayer;
            maxDiffuse = player.game.diffusedBombCount > maxDiffuse ? player.game.diffusedBombCount : maxDiffuse
        });
        const bombKiller = `Mvp Bomb Diffusing Player: ${mvpPlayer} has diffuced ${maxDiffuse} times.`
        console.log(bombKiller)
        this.#MaxBombDiffusePlayer = bombKiller
    }

    getLongestRound(): void {
        let maxRoundDuration = 0; let roundNumber = 0;
        this.#roundLogData.forEach((roundLog) => {
            roundNumber = roundLog.duration > maxRoundDuration ? roundLog.roundNumber : roundNumber
            maxRoundDuration = roundLog.duration > maxRoundDuration ? roundLog.duration : maxRoundDuration
        });

        const longestRound = `Longest round: ${roundNumber} with duration: ${maxRoundDuration} seconds`
        console.log(longestRound)
        this.#LongestRound = longestRound;
    }

    getAllPlayers() {
        return this.#players;
    }

    getAllRounds() {
        return this.#roundLogData;
    }

    getFinalScore() {
        const matchRound = this.#roundLogData[this.#roundLogData.length - 1];
        return { ctTeam: matchRound.team.ctTeam, ctTeamScore: matchRound.team.ctScore, tTeam: matchRound.team.tTeam, tTeamScore: matchRound.team.tScore }
    }

    getHighlights() {
        const highlight = [this.#KillingSpreePlayer, this.#VersatilePlayer, this.#MaxBombDiffusePlayer, this.#LongestRound]
        return { message: highlight }
    }
}

