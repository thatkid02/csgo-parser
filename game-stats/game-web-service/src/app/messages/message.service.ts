import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';
import { Utility } from '../common/utility';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private socket: Socket;


  constructor() { 
    this.socket = io('ws://192.168.29.171:3012');
  }

  public initSocket() {
    this.socket.on('connect', function () {
      console.log("connected !! ")
    })

  }


  async getMessage() {
    let players;

    this.socket.emit('getAllPlayers', "");
    const data = this.socket.on("response", (data:any)=>{
      return data;
    })

    players = fromEvent(data, 'response')
    await Utility.delay(10000)
    return players;
  }

}