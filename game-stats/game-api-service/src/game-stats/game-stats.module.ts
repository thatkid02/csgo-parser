/** Nest and Other NPM Packages **/
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** Service module imports **/
import { GameStatsService } from "./game-stats.service";
import { GameStatsController } from "./game-stats.controller";
import { _MetaLogs } from "src/repos/meta-logs.entity";
import { REDIS_CLIENT } from "src/common/common.types";
import { RedisClient } from "src/config/redisConfig";

@Module({
    imports: [ TypeOrmModule.forFeature([_MetaLogs])],
    controllers: [GameStatsController],
    providers: [
        GameStatsService,
        {
            provide: REDIS_CLIENT,
            useValue: RedisClient
        }
    ],
})

export class GameStatsModule {}
