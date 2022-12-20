import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import axios from 'axios'
import * as fs from 'fs';
import { MatchLogstreamService } from "./match-stats/match-logstream.service";



async function bootstrap() {
    let csgoLogs: any;
    const logger = new Logger("Main");

    try {
        // Get from URL
        csgoLogs = await (await axios.get(process.env.GAME_LOG_URL+123)).data
    } catch (error) {
        logger.log(error);
        // Demo Log
        csgoLogs = await fs.readFileSync('./src/resources/game.log', 'utf8');
    }
    
    const app = await NestFactory.create(AppModule);

    // Logs to Inject
    app.get(MatchLogstreamService).csgoLogs = csgoLogs;
    
    app.enableCors()
    await app.listen(3011);
    logger.log("Microservice started 3011");
}

bootstrap();
