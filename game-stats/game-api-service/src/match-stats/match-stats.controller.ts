/** Nest and Other NPM Packages **/
import { Controller, Get, Req, Res, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

/** Service module imports **/
import { MatchStatsService } from "./match-stats.service";


@Controller()
export class MatchStatsController {
    /**
     * @ignore
     */

    constructor(private readonly matchStatsService: MatchStatsService) {}

    @Get("logs")
    async doGetMatch(@Req() req: Request,@Res() res: Response) {        
        return this.matchStatsService.getDataFromAllLog(res);
    }

    @Get("/players")
    async getPlayers(@Res() res: Response) {
        res.status(200).header({}).send(this.matchStatsService.getAllPlayers());
    }

    @Get("/rounds")
    async getRounds(@Res() res: Response) {
        res.status(200).header({}).send(this.matchStatsService.getAllRounds());
    }

    @Get("/match")
    async getFinalScore(@Res() res: Response) {
        res.status(200).header({}).send(this.matchStatsService.getFinalScore());
    }

    @Get("/highlights")
    async getHighlights(@Res() res: Response) {
        res.status(200).header({}).send(this.matchStatsService.getHighlights());
    }
}
