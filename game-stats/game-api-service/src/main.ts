import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";



const microServiceOptions = {
    transport: Transport.TCP,
    options: {
        host: "0.0.0.0",
        port: 3012,
    },
};

async function bootstrap() {
    const logger = new Logger("Main");
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3012);
    logger.log("Microservice started 3012");
}

bootstrap();
