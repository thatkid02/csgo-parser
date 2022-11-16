import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./config/ormConfig";
import { MatchStatsModule } from "./match-stats/match-stats.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(config),
        MatchStatsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
