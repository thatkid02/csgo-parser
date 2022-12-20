/** Nest and Other NPM Packages **/
import { Injectable, Inject} from "@nestjs/common";
import Redis from "ioredis";

/** Service module imports **/
import { Admins, AllPatterns, Game, MatchRounds, Player, Players, REDIS_CLIENT, RoundInfo } from "../common/common.types";

@Injectable()
export class GameStatsService {

    constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) { }

    async onModuleInit() {
        // this.setPlayerKillLogs();
    }

    /**
     * Controller Method for : /players
     * Check redis if players are set else fetch from the pattern
     * 
     * @returns 
     */
    async getAllPlayers(): Promise<Player[]> {
        let players: Player[];
        if(await this.redisClient.exists(Players)){
            const playerString: string = await this.redisClient.get(Players);
            players = JSON.parse(playerString);
        }else{
            players = await this.getPlayers()
        }
        
        return players;
    }

    async getPlayers(): Promise<Player[]> {
        const players = [{ name: "admin", pId: 0, steamId: "0", side: null, kills: 0, wiki: "", game: { victims: [], weapons: [], tSideScore:0, ctSideScore:0, diffusedBombCount:0}, }];
        const playerLogs = await this.redisClient.lrange(AllPatterns.PlayerEnteredPattern, 0, -1);

        playerLogs.forEach(playerLog => {
            const parsedLog = (JSON.parse(playerLog)).type;
            if (parsedLog) {
                players.forEach(() => {
                    if (!(Admins.includes(parsedLog[1].toLowerCase()))) {
                        // steam id was not set
                        const found = players.some((player, index) => {
                            if(player.name === parsedLog[1]){
                                players[index].name = parsedLog[1];
                                players[index].pId = parsedLog[2];
                                players[index].steamId = parsedLog[3];
                            }
                            return player.name === parsedLog[1]
                        });
                        if (!found) {
                            players.push({ name: parsedLog[1], pId: parsedLog[2], steamId: parsedLog[3], side: null, kills: 0, wiki: "https://liquipedia.net/counterstrike/" + parsedLog[1], game: { victims: [], weapons: [], tSideScore:0, ctSideScore:0, diffusedBombCount:0}})
                        }
                    }
                });
            }
        });
        // Remove admin
        players.shift()
        await this.redisClient.set(Players, JSON.stringify(players));
        return players;
    }

    /**
     * Reset player stats until actual match to get started 
     * MatchStart time should be input from admin to know actual match start time
     * 
     */
    async resetPlayerStatsTillMatchStart() {
        const resetGame: Game = {
            victims: [],
            weapons: [],
            tSideScore: 0,
            ctSideScore: 0
        }

        const matchStartPatternLogs = await this.redisClient.lrange(AllPatterns.WorldMatchStartPattern, 0, -1);
        matchStartPatternLogs.forEach(async log => {
            const matchStartLog = JSON.parse(log);
            const parsedLog = matchStartLog.type;
            const timeMatchStarted = matchStartLog.time;

            const matchRounds: RoundInfo[] = [ { matchStartTime: timeMatchStarted, roundStartTime: null, roundEndTime: null, duration: 0, map: "", roundNumber:0 } ]
            await this.redisClient.set(MatchRounds, JSON.stringify(matchRounds));
            
            const players = await this.getAllPlayers();
            players.forEach((player, index) => {
                players[index].kills = 0;
                players[index].game = resetGame;
                players[index].side = "";
            });
            await this.redisClient.set(Players, JSON.stringify(players));
        });
    }
}

