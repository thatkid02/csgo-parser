import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { _MetaLogs } from "src/repos/meta-logs.entity";
import { AllPatterns } from "src/common/common.types";

@Injectable()
export class GameStatsReadDAL {

    constructor(@InjectRepository(_MetaLogs) private readonly metaLog: Repository<_MetaLogs>) {}

    async getMetaLogByPattern(matchId: string, pattern: AllPatterns) {
        return this.metaLog
            .createQueryBuilder()
            .select()
            .where("match_id = :matchId", { matchId: matchId})
            .andWhere("log_pattern_type = :logPatternType", { logPatternType: pattern })
            .orderBy("log_time", "DESC")
            .getRawMany();
    }
}