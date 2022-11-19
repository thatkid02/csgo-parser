
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



export enum AllPatterns{
PlayerSwitchedPatterns = `"(.+)<(\d+)><([\w:]+)>" switched from team <(Unassigned|Spectator|TERRORIST|CT)> to <(Unassigned|Spectator|TERRORIST|CT)>`,
PlayerSayPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" say(_team)? "(.*)"`,
PlayerEnteredPattern = `"(.+)<(\d+)><([\w:]+)><>" entered the game`,
PlayerPurchasePattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" purchased "(\w+)"`,
PlayerKillAssistPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" assisted killing "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>"`,
PlayerBombPlantedPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Planted_The_Bomb"`,
PlayerBombDefusedPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Defused_The_Bomb"`,
PlayerBlindedPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" blinded for ([\d.]+) by "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" from flashbang entindex (\d+)`,
GameOverPattern = `Game Over: (\w+) (\w+) (\w+) score (\d+):(\d+) after (\d+) mi`,
PlayerKillPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed "((.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?`,
ServerMessagePattern = `server_message: "(\w+)"`,
FreezTimeStartPattern = `Starting Freeze period`,
WorldMatchStartPattern = `World triggered "Match_Start" on "(\w+)"`,
WorldRoundStartPattern = `(.+)? World triggered "Round_Start"`,
WorldRoundRestartPattern = `World triggered "Restart_Round_\((\d+)_second\)`,
WorldRoundEndPattern = `(.+)? World triggered "Round_End"`,
TeamScoredPattern = `Team "(CT|TERRORIST)" scored "(\d+)" with "(\d+)" players`,
}

export const mapped = new Map<AllPatterns, RegExp>(
            [
                [AllPatterns.PlayerSwitchedPatterns, new RegExp(AllPatterns.PlayerSwitchedPatterns)],
                [AllPatterns.PlayerSayPattern, new RegExp(AllPatterns.PlayerSayPattern)],
                [AllPatterns.PlayerEnteredPattern, new RegExp(AllPatterns.PlayerEnteredPattern)],
                [AllPatterns.PlayerPurchasePattern, new RegExp(AllPatterns.PlayerPurchasePattern)],
                [AllPatterns.PlayerKillAssistPattern, new RegExp(AllPatterns.PlayerKillAssistPattern)],
                [AllPatterns.PlayerBombPlantedPattern, new RegExp(AllPatterns.PlayerBombPlantedPattern)],
                [AllPatterns.PlayerBombDefusedPattern, new RegExp(AllPatterns.PlayerBombDefusedPattern)],
                [AllPatterns.PlayerBlindedPattern, new RegExp(AllPatterns.PlayerBlindedPattern)],
                [AllPatterns.GameOverPattern, new RegExp(AllPatterns.GameOverPattern)],
                [AllPatterns.PlayerKillPattern, new RegExp(/"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed "((.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?/i)],
                [AllPatterns.ServerMessagePattern, new RegExp(AllPatterns.ServerMessagePattern)],
                [AllPatterns.FreezTimeStartPattern, new RegExp(AllPatterns.FreezTimeStartPattern)],
                [AllPatterns.WorldMatchStartPattern, new RegExp(AllPatterns.WorldMatchStartPattern)],
                [AllPatterns.WorldRoundStartPattern, new RegExp(AllPatterns.WorldRoundStartPattern)],
                [AllPatterns.WorldRoundRestartPattern, new RegExp(AllPatterns.WorldRoundRestartPattern)],
                [AllPatterns.WorldRoundEndPattern, new RegExp(AllPatterns.WorldRoundEndPattern)],
                [AllPatterns.TeamScoredPattern, new RegExp(AllPatterns.TeamScoredPattern)],
            ]
    )   