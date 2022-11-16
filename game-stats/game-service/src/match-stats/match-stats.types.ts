
export type Player = {
    name: string,
    pId: number,
    steamId: string,
    side: string,
    game?: Game
}

export type Game = {
    victims: string[],
    weapons: string[],
    headshot?: boolean[],
    tSideScore: number,
    ctSideScore: number
}

export interface Log {
    getType(): string,
    getTime(): Date
}

export type MetaData = {
    time: Date,
    type: string
}

export type ServerLogs = {
    metaData: MetaData,
    text: string
}

export type FreezTimeStart = { 
    metaData: MetaData
}

	
export type WorldMatchStart = {
	metaData: MetaData,
    map: string
}


export type WorldRoundStart = { 
    metaData: MetaData,
}

export type WorldRoundRestart = { 
    metaData: MetaData,
    timeLeft: number
}

export type WorldRoundEnd = { 
    metaData: MetaData,
}

export type WorldGameCommencing = { 
    metaData: MetaData,
}


export type TeamScore = {
    metaData: MetaData,
    side: String,
    score: number
}


export type PlayerSwitch = {
    metaData: MetaData,
    player: Player,
    sideCT: boolean,
    sideT: boolean
}

export type PlayerChat = {
    metaData: MetaData,
    player: Player,
    message: string,
    team: string
}

export type Armoury = {
    metaData: MetaData,
    player: Player,
    item: string
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
    metaData: MetaData,
    map: string,
    ctScore: number,
    tscore: number
    duration: number
}

export type unknownLog = {
    metaData: MetaData,
    log: string
}


export enum LogPatterns {

	ServerMessagePattern = `server_message: "(\w+)"`,
	FreezTimeStartPattern = `Starting Freeze period`,
	WorldMatchStartPattern = `World triggered "Match_Start" on "(\w+)"`,
	WorldRoundStartPattern = `World triggered "Round_Start"`,
	WorldRoundRestartPattern = `World triggered "Restart_Round_\((\d+)_second\)`,
	WorldRoundEndPattern = `World triggered "Round_End"`,
	TeamScoredPattern = `Team "(CT|TERRORIST)" scored "(\d+)" with "(\d+)" players`,
	PlayerSwitchedPattern = `"(.+)<(\d+)><([\w:]+)>" switched from team <(Unassigned|Spectator|TERRORIST|CT)> to <(Unassigned|Spectator|TERRORIST|CT)>`,
	PlayerSayPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" say(_team)? "(.*)"`,
	PlayerEnteredPattern = `"(.+)<(\d+)><([\w:]+)><>" entered the game`,
    PlayerPurchasePattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" purchased "(\w+)"`,
	PlayerKillPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" \[(-?\d+) (-?\d+) (-?\d+)\] killed other? "(func_breakable<\d+>?|(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>)" \[(-?\d+) (-?\d+) (-?\d+)\] with "(\w+)" ?(\(?(headshot|penetrated|headshot penetrated)?\))?`,
	PlayerKillAssistPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" assisted killing "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>"`,
	PlayerBombPlantedPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Planted_The_Bomb"`,
    PlayerBombDefusedPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" triggered "Defused_The_Bomb"`,
	PlayerBlindedPattern = `"(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" blinded for ([\d.]+) by "(.+)<(\d+)><([\w:]+)><(TERRORIST|CT)>" from flashbang entindex (\d+)`,
	GameOverPattern = `Game Over: (\w+) (\w+) (\w+) score (\d+):(\d+) after (\d+) min`
}

