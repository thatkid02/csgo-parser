import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { GameStatsService } from 'src/game-stats/game-stats.service';
import { RedisClient } from 'src/config/redisConfig';
import { REDIS_CLIENT } from 'src/common/common.types';

@Module({
  providers: [MessagesGateway, MessagesService, GameStatsService,
    {
      provide: REDIS_CLIENT,
      useValue: RedisClient
    }
  ]
})
export class MessagesModule { }
