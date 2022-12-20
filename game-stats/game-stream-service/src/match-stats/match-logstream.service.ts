/** Nest and Other NPM Packages **/
import { Injectable, Inject } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import Redis from "ioredis";

/** Service module imports **/
import { MatchLogstreamWriteDal } from "./match-logstream.write.dal";
import { AllPatterns, MatchLogPattern, MetaLog, REDIS_CLIENT } from "./match-logstream.types";

@Injectable()
export class MatchLogstreamService {
    csgoLogs: string;

    #logger: fs.WriteStream;
    #logData: string[];


    constructor(
        private readonly matchLogstreamWrite: MatchLogstreamWriteDal,
        @Inject(REDIS_CLIENT) private readonly redisClient: Redis
    ) { }

    onModuleInit() {
        this.#logData = this.csgoLogs.split(/\r?\n/);
        this.#logger = fs.createWriteStream('playersInfoNew.json', {
            // flags: 'a' 
        })

        this.#setMetaData(this.#logData);
    }

    /**
     * This function sets the metadata in redis based of incoming logs
     * right now reading from file is set in redis for interval of 1 second 
     * 
     * @param {log} log 
     */
    #setMetaData(log: string[]){

        log.forEach((line, index) => {
            setTimeout(() => {
                const parsedLog = line.split(": ", 2)
                const [matchedPattern, key] = this.#getLogAllPatern(parsedLog[1])

                if (matchedPattern) {
                    let meta: MetaLog = { time: new Date(parsedLog[0].replace("-", "")), type: matchedPattern, key: key as unknown as AllPatterns, isInserted: false }

                    this.redisClient.lrem(key, 0, JSON.stringify(meta), (err, reply) => {
                        if (err) {
                          console.error(err);
                        } else {
                          // Value was not present in the list
                          this.redisClient.rpush(key, JSON.stringify(meta), (err) => {
                            if (err) {
                              console.error(err);
                            }
                          });
                        }
                      });
                    // this.#logger.write(JSON.stringify(meta) + "\n")
                }
            }, index*1000);
        });
    }

    /**
     * This function matches the pattern and returns the type and matched object
     * example: {"time":"2021-11-28T20:41:29.000Z","type":["\"Kyojin<34><STEAM_1:1:22851120><CT>\" say \"hf\"","Kyojin","34","STEAM_1:1:22851120","CT",null,"hf"],"key":"PlayerSayPattern"}
     * 
     * @param {log} log 
     * @returns [matchedPattern, matchedKey]
     */
    #getLogAllPatern(log: string): [string, string] {
        let matchedPattern; let matchedKey
        MatchLogPattern.forEach((pattern, key) => {

            const match = pattern.test(log)
            if (match) {
                matchedPattern = pattern.exec(log)
                matchedKey = key
            }
            return false;
        })
        return [matchedPattern, AllPatterns[matchedKey]]

    }

    /************************************
     *         CRON Schedules           *
     ************************************/

    @Cron(CronExpression.EVERY_10_MINUTES)
    insertLogs() {
        MatchLogPattern.forEach(async (pattern, key) => {
            const checkRedisKey = await this.redisClient.exists(AllPatterns[key]);

            if(checkRedisKey){
                const parsedLog = await this.redisClient.lrange(AllPatterns[key], 0, -1)
                
                parsedLog.forEach(async (logObject, index) => {
                    
                    if(logObject){
                        const logParsedObject = JSON.parse(logObject);
                        if(!logParsedObject.isInserted){
                            await this.matchLogstreamWrite.insertGameLogs({
                                matchId: "Nelson",
                                rawLog: logParsedObject['type'],
                                logTime: logParsedObject['time'],
                                logPatternType: AllPatterns[key],
                                logParsedItems: logParsedObject['type']
                            })
                        }
                        // Mark so that its already inserted
                        await this.redisClient.lset(AllPatterns[key], index, JSON.stringify({ ...logParsedObject, isInserted: true }))
                    }
                });
            }
        });
    }
}