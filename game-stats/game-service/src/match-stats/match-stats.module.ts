/** Nest and Other NPM Packages **/
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** Service module imports **/
import { MatchStatsService } from "./match-stats.service";
import { MatchStatsWriteDal } from "./match-stats.write.dal";
import { MatchStatsController } from "./match-stats.controller";
import { GameLogs } from "src/repos/game-logs.entity";

@Module({
    imports: [ TypeOrmModule.forFeature([GameLogs])],
    controllers: [MatchStatsController],
    providers: [
        MatchStatsWriteDal,
        MatchStatsService
    ],
})

export class MatchStatsModule {}
