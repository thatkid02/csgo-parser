import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { interval } from 'rxjs' ;
import { GameStatsService } from 'src/game-stats/game-stats.service';
import { Utility } from 'src/common/utility';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly gameStatsService: GameStatsService
    ) {
    
  }

  onModuleInit(){
    // if players not set in redis
    this.getPlayers();
  } 

  @SubscribeMessage('getAllPlayers')
  async getPlayers() {
    interval(10000).subscribe(async() => {
    const players = await this.gameStatsService.getAllPlayers();

    this.server.emit('response', players);
    });
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto) {
    console.log(createMessageDto)
    const message = await this.messagesService.create(createMessageDto);
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody('name') name:string, @ConnectedSocket() client: Socket) {
    return this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('updating') //typing
  async updating(@MessageBody('isUpdating') isUpdating:boolean, @ConnectedSocket() client: Socket) {
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('updating', { name, isUpdating })
  }
}
