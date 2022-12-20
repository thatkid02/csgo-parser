import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./config/ormConfig";
import { MatchStatsModule } from "./match-stats/match-stats.module";
import { GameStatsModule } from "./game-stats/game-stats.module";
import { MessagesModule } from './messages/messages.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(config),
        GameStatsModule,
        MatchStatsModule,
        MessagesModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
