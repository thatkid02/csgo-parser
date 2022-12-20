/** Nest and Other NPM Packages **/
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/** Service module imports **/
import { MatchStatsService } from "./match-stats.service";
import { MatchStatsWriteDal } from "./match-stats.write.dal";
import { MatchStatsController } from "./match-stats.controller";
import { _MetaLogs } from "src/repos/meta-logs.entity";

@Module({
    imports: [ TypeOrmModule.forFeature([_MetaLogs])],
    controllers: [MatchStatsController],
    providers: [
        MatchStatsWriteDal,
        MatchStatsService,
        {
            provide: "csgoLogs",
            useValue: "csgoLogs"
        }
    ],
})

export class MatchStatsModule {}
