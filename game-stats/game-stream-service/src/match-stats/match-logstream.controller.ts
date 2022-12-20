/** Nest and Other NPM Packages **/
import { Controller, Get, Res } from "@nestjs/common";
import { Response } from 'express';

/** Service module imports **/
import { MatchLogstreamService } from "./match-logstream.service";


@Controller()
export class MatchLogstreamController {

    @Get()
    healthCheck(@Res() res: Response) {
      res.status(200).header({}).send({ message: "Healthy As Always!!!"});
    }
}
