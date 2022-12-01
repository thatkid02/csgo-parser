import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-round-stats',
  templateUrl: './round-stats.component.html',
  styleUrls: ['./round-stats.component.css']
})
export class RoundStatsComponent {
  roundData: any = null;
  http;
  displayedColumns: string[] = ['roundNumber', 'duration', 'team', 'teamName'];

  constructor(http: HttpClient) {
    this.http = http;
  }

  async getAllRounds() {
    await this.http.get('http://localhost:3012/rounds').subscribe(response => {
      this.roundData = response;
    })

  }

  async ngOnInit() {
    await this.getAllRounds()
  }
}

export interface RoundElement {
  duration: number,
  map: string,
  roundNumber: number,
  roundStartTime: Date,
  roundEndTime: Date,
  team: TeamScore
}
export interface TeamScore {
  ctScore: number, 
  tScore: number, 
  ctTeam: string, 
  tTeam: string
}