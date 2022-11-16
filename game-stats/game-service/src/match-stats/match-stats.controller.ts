/** Nest and Other NPM Packages **/
import { Controller, Get, Req, Res } from "@nestjs/common";
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
}
