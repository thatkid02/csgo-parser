/** Nest and Other NPM Packages **/
import { Controller, Get, Req, Res, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

/** Service module imports **/
import { GameStatsService } from "./game-stats.service";


@Controller()
export class GameStatsController {

    constructor(private readonly gameStatsService: GameStatsService) {}

    @Get("/players")
    async getPlayers(@Res() res: Response) {
        res.status(200).header({}).send(await this.gameStatsService.getAllPlayers());
    }

}
