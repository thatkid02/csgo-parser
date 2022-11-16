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
    #killedLogData: any[] = [];

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
        this.getPlayerKillLogs();

        this.#logger.write(JSON.stringify(this.#players))
        // this.getStarPlayer(players);
        // this.getMostKills(players)

        // this.test()
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


        const re = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed "((.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?/i)

        const isLog = re.test(line);

        if (isLog) {
            const parsedLog = re.exec(line);
            // this.#logger.write(JSON.stringify(parsedLog)+"\n")
            return parsedLog;
        }
    }

    getPlayers(): Player[] {
        this.#players = [{ name: "admin", pId: 0, steamId: "0", side: null }];

        this.#logData.forEach(line => {
            if (this.#players.length < 12) {
                const parsedLog = this.getLogForPattern(line, LogPatterns.PlayerEnteredPattern);
                if (parsedLog) {
                    this.#killedLogData.push(parsedLog)
                    this.#players.forEach(() => {
                        const found = this.#players.some(player => player.name === parsedLog[1])
                        if (!found) {
                            this.#players.push({ name: parsedLog[1], pId: parsedLog[2], steamId: parsedLog[3], side: null })
                        }
                    });
                }
            }
        });
        // Remove admin
        this.#players.shift()
        return this.#players;
    }

    getPlayerKillLogs() {
        let playerKillScore = []

        this.#players.forEach(player => {
            this.#killedLogData.forEach(parsedLog => {
                    if (player.name == parsedLog[1]) {
                        // first time it will fail
                        playerKillScore = this.dest(playerKillScore, parsedLog)
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
        this.reduceKiller(playerKillScore);
        
    }

    prepare(playerKillScore,parsedLog){
        playerKillScore.forEach(kplayer => {
            const found = playerKillScore.some(player =>player.attacker === parsedLog[1])
            if (found) {
                kplayer.victim.push(parsedLog[9])
                if (parsedLog[4] == "CT") {
                    kplayer.ctSideScore = kplayer.ctSideScore + 1;
                } else {
                    kplayer.tSideScore = kplayer.tSideScore + 1;
                }
                kplayer.weapon.push(parsedLog[16])
            } else {
                playerKillScore.push({
                    attacker: parsedLog[1],
                    victim: [parsedLog[9]],
                    ctSideScore: parsedLog[4] == "CT" ? 1 : 0,
                    tSideScore: parsedLog[4] == "CT" ? 0 : 1,
                    weapon: [parsedLog[16]]
                } as PlayerKillScore)

            }
            kplayer.victim = Array.from((new Set<string>(kplayer.victim)).values());
            kplayer.weapon = Array.from((new Set<string>(kplayer.weapon)).values());
        });

        return playerKillScore
    }

    dest(playerKillScore,parsedLog){
        playerKillScore.push({
            attacker: parsedLog[1],
            victim: parsedLog[9],
            ctSideScore: parsedLog[4] == "CT" ? 1 : 0,
            tSideScore: parsedLog[4] == "CT" ? 0 : 1,
            weapon: parsedLog[16]
        } as PlayerKillScore)
        return playerKillScore
    }

    reduceKiller(playerKillScore){
        const killerPlayers = []
        this.#players.forEach((player)=>{
            player.game = { victims:[],weapons:[],tSideScore:0,ctSideScore:0}
            playerKillScore.forEach(killer => {
                if(player.name == killer.attacker){
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


    getStarPlayer(players: PlayerKillScore[]) {
        let maxWeaponCount = 0; let starPlayer = "admin";
        players.forEach(player => {
            starPlayer = player.weapon.length > maxWeaponCount ? player.attacker : starPlayer
            maxWeaponCount = player.weapon.length > maxWeaponCount ? player.weapon.length : maxWeaponCount
            if (player.attacker == "Boombl4") console.log(player.weapon)
        });
        console.log(`Player ${starPlayer} has used ${maxWeaponCount} variety of weapons`)
    }

    getMostKills(players: PlayerKillScore[]) {
        let maxKills = 0; let starPlayer = "admin";
        players.forEach(player => {
            starPlayer = player.tSideScore + player.ctSideScore > maxKills ? player.attacker : starPlayer
            maxKills = player.tSideScore + player.ctSideScore > maxKills ? player.tSideScore + player.ctSideScore : maxKills
        });
        console.log(`Player ${starPlayer} has score of ${maxKills}`)
    }

    test() {

        const a = [
            "\"s1mple<30><STEAM_1:1:36968273><TERRORIST>\" [1050 -1336 -408] killed other \"func_breakable<416>\" [1143 -797 -344] with \"glock\"",
            "s1mple",
            "30",
            "STEAM_1:1:36968273",
            "TERRORIST",
            "1050",
            "-1336",
            "-408",
            "other ",
            "func_breakable<416>",
            "func_breakable<416>",
            null,
            null,
            null,
            null,
            null,
            "1143",
            "-797",
            "-344",
            "glock",
            null,
            null]

        const b = ["\"s1mple<30><STEAM_1:1:36968273><TERRORIST>\" [1191 -891 -408] killed \"apEX<25><STEAM_1:1:14739219><CT>\" [2504 -344 -289] with \"ak47\" (headshot)",
            "s1mple",
            "30",
            "STEAM_1:1:36968273",
            "TERRORIST",
            "1191",
            "-891",
            "-408",
            null,
            "apEX<25><STEAM_1:1:14739219><CT>",
            null,
            "apEX<25><STEAM_1:1:14739219><CT>",
            "apEX",
            "25",
            "STEAM_1:1:14739219",
            "CT",
            "2504",
            "-344",
            "-289",
            "ak47",
            "(headshot)",
            "headshot"]
        for (const iterator of a) {
            console.log(a)
        }
    }
}

