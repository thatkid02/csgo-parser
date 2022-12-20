
export const Players = "Players";

export const Admins = [
    "prius", "(1)gotv", "linaaa"
]

export type Player = {
    name: string,
    pId: number,
    steamId: string,
    side: string,
    kills: number,
    game?: Game,
    wiki: string
}

export type Game = {
    victims: string[],
    weapons: string[],
    headshot?: boolean[],
    diffusedBombCount?: number,
    tSideScore: number,
    ctSideScore: number
}

export interface Log {
    getType(): string,
    getTime(): Date
}

export type MetaData = {
    time: Date,
    type: any
}

export type PlayerKillScore = {
    attacker: string,
    victim: string[],
    weapon: string[],
    headshot?: boolean[],
    tSideScore: number,
    ctSideScore: number
}


export type KillAssist = {
    metaData: MetaData,
    attacker: Player,
    victim: Player
}

export type BombPlant = {
    metaData: MetaData,
    player: Player
}

export type BombDefused = {
    metaData: MetaData,
    player: Player,
    hasKit: boolean
}

export type BlindedFlash = {
    metaData: MetaData,
    attacker: Player,
    victim: Player,
    duration: number
}

export type RoundInfo = {
    roundStartTime: Date,
    roundEndTime: Date,
    roundNumber: number,
    map?: string,
    team?: TeamScore,
    duration: any
}

export type TeamScore = {
    ctTeam?: string,
    tTeam?: string,
    ctScore?: number,
    tScore?: number,
}

export type unknownLog = {
    metaData: MetaData,
    log: string
}


export const PlayerSwitchedPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)>" switched from team <(Unassigned|Spectator|TERRORIST|CT)> to <(Unassigned|Spectator|TERRORIST|CT)>/i);
export const PlayerSayPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" say(_team)? "(.*)"/i);
export const PlayerEnteredPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><>" entered the game/i);
export const PlayerPurchasePattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" purchased "(\w+)"/i);
export const PlayerKillAssistPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" assisted killing "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>"/i);
export const PlayerBombPlantedPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Planted_The_Bomb"/i);
export const PlayerBombDefusedPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Defused_The_Bomb"/i);
export const PlayerBlindedPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" blinded for ([\d.]+) by "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" from flashbang entindex (\d+)/i);
export const GameOverPattern = new RegExp(/Game Over: (\w+) (\w+) (\w+) score (\d+):(\d+) after (\d+) mi/i);
export const PlayerKillPattern = new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed "((.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?/i);
export const ServerMessagePattern = new RegExp(/server_message: "(\w+)"/i);
export const FreezTimeStartPattern = new RegExp(/Starting Freeze period/i);
export const WorldMatchStartPattern = new RegExp(/World triggered "Match_Start" on "(\w+)"/i);
export const WorldRoundStartPattern = new RegExp(/(.+)? World triggered "Round_Start"/i);
export const WorldRoundRestartPattern = new RegExp(/World triggered "Restart_Round_\((\d+)_second\)/i);
export const WorldRoundEndPattern = new RegExp(/(.+)? World triggered "Round_End"/i);
export const RoundScorePattern = new RegExp(/.+? MatchStatus\: Score\: (\d{1}|\d{2}):(\d{1}|\d{2}) on map \"(.+)\" RoundsPlayed: (.+)/i);
export const TeamPlayingPattern = new RegExp(/.+? MatchStatus\: Team playing "(CT|TERRORIST)": (.+)/i);



export enum AllPatterns {
    PlayerSwitchedPatterns = "PlayerSwitchedPatterns",
    PlayerSayPattern = "PlayerSayPattern",
    PlayerEnteredPattern = "PlayerEnteredPattern",
    PlayerPurchasePattern = "PlayerPurchasePattern",
    PlayerKillAssistPattern = "PlayerKillAssistPattern",
    PlayerBombPlantedPattern = "PlayerBombPlantedPattern",
    PlayerBombDefusedPattern = "PlayerBombDefusedPattern",
    PlayerBlindedPattern = "PlayerBlindedPattern",
    GameOverPattern = "GameOverPattern",
    PlayerKillPattern = "PlayerKillPattern",
    ServerMessagePattern = "ServerMessagePattern",
    FreezTimeStartPattern = "FreezTimeStartPattern",
    WorldMatchStartPattern = "WorldMatchStartPattern",
    WorldRoundStartPattern = "WorldRoundStartPattern",
    WorldRoundRestartPattern = "WorldRoundRestartPattern",
    WorldRoundEndPattern = "WorldRoundEndPattern",
    TeamScoredPattern = "TeamScoredPattern",
}

export const mapped = new Map<AllPatterns, RegExp>(
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


import { type } from "os";

export const CSGO_LOGS = "csgoLogs";
export const REDIS_CLIENT = "REDIS_CLIENT";

export type MetaLog = {
    time: Date,
    type: any,
    key: AllPatterns,
    isInserted: boolean
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