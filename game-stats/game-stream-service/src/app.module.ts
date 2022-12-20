import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./config/ormConfig";
import { MatchLogstreamModule } from "./match-stats/match-logstream.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(config),
        MatchLogstreamModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
