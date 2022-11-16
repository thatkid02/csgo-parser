/** Nest and Other NPM Packages **/
import { Injectable, Req, Res } from "@nestjs/common";
import * as fs from 'fs';
import { MetaData, Player, PlayerKillPattern, PlayerKillScore, RoundInfo, WorldRoundEndPattern, WorldRoundStartPattern } from "./match-stats.types";
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

        this.#logger.write(JSON.stringify(this.#roundLogData))
    }

    getDataFromAllLog(res) {
        return res.status(200).header({}).send();
    }

    private static getType(metaData: MetaData): string {
        return metaData.type;
    }

    private static getTime(metaData: MetaData): Date {
        return metaData.time;
    }


    getLogForPattern(line: string, pattern: RegExp) {
        const log = this.csgoLogPattern.exec(line);

        if (!log) return { message: "no match found" };
    
        const isLog = pattern.test(line);

        if (isLog) return pattern.exec(line);
    }

    getPlayers(): Player[] {
        this.#players = [{ name: "admin", pId: 0, steamId: "0", side: null }];

        this.#logData.forEach(line => {
            if (this.#players.length < 12) {
                const parsedLog = this.getLogForPattern(line, PlayerKillPattern);
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
    setPlayerStats(playerKillScore,parsedLog){
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
    setPlayerGameStats(playerKillScore){
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

    getAllRoundInfo(){
        let roundLog = { roundStartTime: null, roundEndTime: null}
        let roundCount = 0;
        this.#logData.forEach((line)=> {
            
            const startLog = this.getLogForPattern(line, WorldRoundStartPattern);
            const endLog = this.getLogForPattern(line, WorldRoundEndPattern);
            
            if(startLog){
                roundLog.roundStartTime = new Date(startLog[1].replace("-","").slice(0, -1));
            }

            if(endLog){
                roundLog.roundEndTime = new Date(endLog[1].replace("-","").slice(0, -1));
            }

            if(roundLog.roundStartTime != null && roundLog.roundEndTime != null){
                roundCount += 1
                this.#roundLogData.push({...roundLog, roundNumber: roundCount, duration: Math.round(((roundLog.roundEndTime-roundLog.roundStartTime)+Number.EPSILON)/1000)})
                roundLog = { roundStartTime: null, roundEndTime: null}
            }
        });

    }

    //  Analysis Starts here
    getVersatilePlayer(): void {
        let maxWeaponCount = 0; let starPlayer = "admin";
        this.#players.forEach(player => {
            starPlayer = player.game.weapons.length > maxWeaponCount ? player.name : starPlayer
            maxWeaponCount = player.game.weapons.length > maxWeaponCount ? player.game.weapons.length : maxWeaponCount
        });
        console.log(`Versatile Player: ${starPlayer} has used ${maxWeaponCount} variety of weapons`)
    }

    getKillingSpreePlayer(): void{
        let maxKills = 0; let starPlayer = "admin";
        this.#players.forEach(player => {
            starPlayer = player.game.ctSideScore + player.game.tSideScore > maxKills ? player.name : starPlayer
            maxKills = player.game.tSideScore + player.game.ctSideScore > maxKills ? player.game.tSideScore + player.game.ctSideScore : maxKills
        });
        console.log(`Killng Spree Player: ${starPlayer} has killed total of ${maxKills}`)
    }

    getLongestRound(): void{
        let maxRoundDuration = 0; let roundNumber=0;
        this.#roundLogData.forEach((roundLog)=>{
            roundNumber = roundLog.duration > maxRoundDuration ? roundLog.roundNumber : roundNumber
            maxRoundDuration = roundLog.duration > maxRoundDuration ? roundLog.duration : maxRoundDuration
        });

        console.log(`Longest round: ${roundNumber} with duration: ${maxRoundDuration} seconds`) 
    }
}

