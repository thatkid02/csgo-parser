/** Nest and Other NPM Packages **/
import { Injectable, Req, Res } from "@nestjs/common";
import * as fs from 'fs';
import { LogPatterns, MetaData, Player, PlayerKillScore } from "./match-stats.types";
const execSync = require('child_process').execSync;

/** Service module imports **/
import { MatchStatsWriteDal } from "./match-stats.write.dal";

@Injectable()
export class MatchStatsService {
    #file;
    #logger;
    #logData: string[];
    #players: Player[];

    private readonly csgoLogPattern = new RegExp(/(\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}): (.*)/i);

    constructor(
        private readonly matchStatsWrite: MatchStatsWriteDal,
    ) {
        this.#file = fs.readFileSync('./src/resources/g1.log', 'utf8');
        this.#logData = this.#file.split(/\r?\n/);
        this.#logger = fs.createWriteStream('log.json', {
            // flags: 'a' 
          })
    }


    onModuleInit() {
        this.#players = this.getPlayers();
        const players = this.getPlayerKillLogs();
        this.#logger.write(JSON.stringify(players))
        this.getStarPlayer(players);
        this.getMostKills(players)
    }

    getLog(req, res) {
        return res.status(200).header({}).send();
    }

    getDataFromAllLog(res) {
        return res;
    }

    private static getType(metaData: MetaData): string {
        return metaData.type;
    }

    private static getTime(metaData: MetaData): Date {
        return metaData.time;
    }


    getLogForPattern(line: string, pattern: LogPatterns) {
        const log = this.csgoLogPattern.exec(line);

        if (!log) return { message: "no match found" };


        const re = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed (other )?"((func_breakable<\d+>)?|((.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>)?)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?/i)

        const isLog = re.test(line);

        if (isLog) {
            const parsedLog = re.exec(line);
            return parsedLog;
        }
    }

    getPlayers(): Player[] {
        this.#players = [{ name: "admin", pId: 0, steamId: "0", side: null }];
        this.#logData.forEach(line => {
            if (this.#players.length < 12) {
                const parsedLog = this.getLogForPattern(line, LogPatterns.PlayerEnteredPattern);
                if (parsedLog) {
                    this.#players.forEach(() => {
                        const found = this.#players.some(player => player.name === parsedLog[1])
                        if (!found) {
                            this.#players.push({ name: parsedLog[1], pId: parsedLog[2], steamId: parsedLog[3], side: null })
                        }
                    });
                }
            }
        });
        return this.#players;
    }

    getPlayerKillLogs(): PlayerKillScore[] {
        let playerKillScore = []

        this.#players.forEach(player => {

            this.#logData.forEach(line => {
                const parsedLog = this.getLogForPattern(line, LogPatterns.PlayerKillPattern);
                if (parsedLog) {
                    
                    if (player.name == parsedLog[1]) {
                    
                        if(playerKillScore.length==0){
                            playerKillScore.push({
                                attacker: parsedLog[1],
                                victim: [parsedLog[9]],
                                ctSideScore: 0,
                                tSideScore: 0,
                                weapon: [parsedLog[19]]
                            } as PlayerKillScore)
                        }
                        playerKillScore.forEach(kplayer => {
                            if (!kplayer.attacker) return;
                            const found = playerKillScore.some(player => player.attacker === parsedLog[1])
                            if (found) {
                                parsedLog[8] == "other "? kplayer.victim.push(parsedLog[9]): kplayer.victim.push(parsedLog[10])
                                if (parsedLog[4] == "CT") {
                                    kplayer.ctSideScore = kplayer.ctSideScore + 1;
                                } else {
                                    kplayer.tSideScore = kplayer.tSideScore + 1;
                                }
                                kplayer.weapon.push(parsedLog[19])
                            } else {
                                    playerKillScore.push({
                                        attacker: parsedLog[1],
                                        victim: [parsedLog[9]],
                                        ctSideScore: 0,
                                        tSideScore: 0,
                                        weapon: [parsedLog[19]]
                                    } as PlayerKillScore)
                                
                            }
                            kplayer.victim = Array.from((new Set<string>(kplayer.victim)).values());
                            kplayer.weapon = Array.from((new Set<string>(kplayer.weapon)).values());
                        })
                    }
                }
            });
        });

        return playerKillScore;
    }

    getStarPlayer(players: PlayerKillScore[]){
        let maxWeaponCount = 0; let starPlayer="admin";
        players.forEach(player => {
            starPlayer = player.weapon.length > maxWeaponCount ? player.attacker: starPlayer
            maxWeaponCount = player.weapon.length > maxWeaponCount ? player.weapon.length: maxWeaponCount
            if(player.attacker == "Boombl4") console.log(player.weapon)
        });
        console.log(`Player ${starPlayer} has used ${maxWeaponCount} variety of weapons`)
    }

    getMostKills(players: PlayerKillScore[]){
        let maxKills = 0; let starPlayer="admin";
        players.forEach(player => {
            starPlayer = player.tSideScore+player.ctSideScore > maxKills ? player.attacker: starPlayer
            maxKills = player.tSideScore+player.ctSideScore > maxKills ? player.tSideScore+player.ctSideScore: maxKills
        });
        console.log(`Player ${starPlayer} has score of ${maxKills}`)
    }
}

