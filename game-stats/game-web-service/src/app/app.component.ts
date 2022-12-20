import { Component } from '@angular/core';
import { MessageService } from './messages/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  title = 'game-web';

  constructor(private readonly socketIoService: MessageService){}
  
  ngOnInit(): void{
    console.log("*********************************")
    this.socketIoService.initSocket();
    // this.socketIoService.getMessage();
  }
    
}
