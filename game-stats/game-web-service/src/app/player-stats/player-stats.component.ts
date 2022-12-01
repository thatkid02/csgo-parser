import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PlayerStatsComponent implements OnInit {
  players: any = null;
  http;

  constructor(http: HttpClient) {
    this.http = http;
    this.sortedData = this.players;
  }

  async getAllPlayers() {
    await this.http.get('http://localhost:3012/players').subscribe(response => {
      this.players = response;
    })

  }

  async ngOnInit() {
    await this.getAllPlayers()
  }

  columnsToDisplayPlayer = ['name', 'pId', 'team', 'kills'];

  columnsToDisplayWithExpand = [...this.columnsToDisplayPlayer, 'expand'];

  expandedElement: PlayerElement | null;

  sortedData: PlayerElement[];

  sortData(sort: Sort) {
    const data = this.players;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a: { name: string | number; pId: string | number; team: string | number; kills: string | number; }, b: { name: string | number; pId: string | number; team: string | number; kills: string | number; }) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'pId':
          return compare(a.pId, b.pId, isAsc);
        case 'team':
          return compare(a.team, b.team, isAsc);
        case 'kills':
          return compare(a.kills, b.kills, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

export interface PlayerElement {
  name: string,
  pId: number,
  steamId: string,
  side: string,
  wiki: string,
  game: Game
}

export interface Game {
  victims: string[],
  weapons: string[],
  tSideScore: number,
  ctSideScore: number,
  diffusedBombCount: number
}
