/** Nest and Other NPM Packages **/
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { _MetaLogs } from "src/repos/meta-logs.entity";
import { DeepPartial, Repository } from "typeorm";


@Injectable()
export class MatchStatsWriteDal {

    constructor(@InjectRepository(_MetaLogs) private readonly GameLogs: Repository<_MetaLogs>) {}

    insertGameLogs(matchStat: DeepPartial<_MetaLogs>) {
        return this.GameLogs.insert(this.GameLogs.create(matchStat));
    }

    updateGameLogs(conditions, GameLogsObj: DeepPartial<_MetaLogs>) {
        return this.GameLogs.update(conditions, this.GameLogs.create(GameLogsObj));
    }  
}