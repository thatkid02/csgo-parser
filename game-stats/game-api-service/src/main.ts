import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import axios from 'axios'
import * as fs from 'fs';
import { MatchStatsService } from "./match-stats/match-stats.service";



async function bootstrap() {
    let csgoLogs: any;
    const logger = new Logger("Main");

    try {
        // Get from URL
        csgoLogs = await (await axios.get(process.env.GAME_LOG_URL+123)).data
    } catch (error) {
        logger.log(error);
        // Demo Log
        csgoLogs = await fs.readFileSync('./src/resources/gameStart.txt', 'utf8');
    }
    
    const app = await NestFactory.create(AppModule);

    // Logs to Inject
    app.get(MatchStatsService).csgoLogs = csgoLogs;
    
    app.enableCors()
    await app.listen(3012);
    logger.log("Microservice started 3012");
}

bootstrap();
