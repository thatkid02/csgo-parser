import { type } from "os";

export const CSGO_LOGS = "csgoLogs";
export const REDIS_CLIENT = "REDIS_CLIENT";

export type MetaLog = {
    time: Date,
    type: any,
    key: AllPatterns,
    isInserted: boolean
}

export enum AllPatterns {
    PlayerSwitchedPatterns,
    PlayerSayPattern,
    PlayerEnteredPattern,
    PlayerPurchasePattern,
    PlayerKillAssistPattern,
    PlayerBombPlantedPattern,
    PlayerBombDefusedPattern,
    PlayerBlindedPattern,
    GameOverPattern,
    PlayerKillPattern,
    ServerMessagePattern,
    FreezTimeStartPattern,
    WorldMatchStartPattern,
    WorldRoundStartPattern,
    WorldRoundRestartPattern,
    WorldRoundEndPattern,
    TeamScoredPattern,
}

export const MatchLogPattern = new Map<AllPatterns, RegExp>(
    [
        [AllPatterns.PlayerSwitchedPatterns, new RegExp(/"(.+)<(\d+)><([\w:]+)>" switched from team <(Unassigned|Spectator|TERRORIST|CT)> to <(Unassigned|Spectator|TERRORIST|CT)>/i)],
        [AllPatterns.PlayerSayPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" say(_team)? "(.*)"/i)],
        [AllPatterns.PlayerEnteredPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><>" entered the game/i)],
        [AllPatterns.PlayerPurchasePattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" purchased "(\w+)"/i)],
        [AllPatterns.PlayerKillAssistPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" assisted killing "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>"/i)],
        [AllPatterns.PlayerBombPlantedPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Planted_The_Bomb"/i)],
        [AllPatterns.PlayerBombDefusedPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Defused_The_Bomb""/i)],
        [AllPatterns.PlayerBlindedPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" blinded for ([\d.]+) by "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" from flashbang entindex (\d+)/i)],
        [AllPatterns.GameOverPattern, new RegExp(/Game Over: (\w+) (\w+) (\w+) score (\d+):(\d+) after (\d+) mi/)],
        [AllPatterns.PlayerKillPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed "((.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?/i)],
        [AllPatterns.ServerMessagePattern, new RegExp(/server_message: "(\w+)"/i)],
        [AllPatterns.FreezTimeStartPattern, new RegExp(/Starting Freeze period/i)],
        [AllPatterns.WorldMatchStartPattern, new RegExp(/World triggered "Match_Start" on "(\w+)"/i)],
        [AllPatterns.WorldRoundStartPattern, new RegExp(/(.+)? World triggered "Round_Start"/i)],
        [AllPatterns.WorldRoundRestartPattern, new RegExp(/World triggered "Restart_Round_\((\d+)_second\)/i)],
        [AllPatterns.WorldRoundEndPattern, new RegExp(/(.+)? World triggered "Round_End"/i)],
        [AllPatterns.TeamScoredPattern, new RegExp(/Team "(CT|TERRORIST)" scored "(\d+)" with "(\d+)" players/i)],
    ]
)   