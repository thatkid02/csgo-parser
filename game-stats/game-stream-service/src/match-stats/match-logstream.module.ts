/** Nest and Other NPM Packages **/
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from '@nestjs/schedule';

/** Service module imports **/
import { MatchLogstreamService } from "./match-logstream.service";
import { MatchLogstreamWriteDal } from "./match-logstream.write.dal";
import { MatchLogstreamController } from "./match-logstream.controller";
import { _MetaLogs } from "src/repos/meta-logs.entity";
import { CSGO_LOGS, REDIS_CLIENT } from "./match-logstream.types";
import { RedisClient } from "src/config/redisConfig";

@Module({
    imports: [ TypeOrmModule.forFeature([_MetaLogs]), ScheduleModule.forRoot() ],
    controllers: [MatchLogstreamController],
    providers: [
        MatchLogstreamService,
        MatchLogstreamWriteDal,
        {
            provide: CSGO_LOGS,
            useValue: CSGO_LOGS
        },
        {
            provide: REDIS_CLIENT,
            useValue: RedisClient
        }
    ],
})

export class MatchLogstreamModule {}
