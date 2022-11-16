/** Nest and Other NPM Packages **/
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameLogs } from "src/repos/game-logs.entity";
import { DeepPartial, Repository } from "typeorm";


@Injectable()
export class MatchStatsWriteDal {

    constructor(@InjectRepository(GameLogs) private readonly GameLogs: Repository<GameLogs>) {}

    insertGameLogs(matchStat: DeepPartial<GameLogs>) {
        return this.GameLogs.insert(this.GameLogs.create(matchStat));
    }

    updateGameLogs(conditions, GameLogsObj: DeepPartial<GameLogs>) {
        return this.GameLogs.update(conditions, this.GameLogs.create(GameLogsObj));
    }  
}