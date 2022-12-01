import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http"


export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
}

/**
 * @title Dynamic grid-list
 */
@Component({
    selector: 'grid-list-dynamic-example',
    templateUrl: `./game-stats.component.html`,
    styleUrls: [`./game-stats.component.css`],

})
export class GameStatsComponent implements OnInit {
    http;
    highlights: any = { message: [] };
    message: string[] = [];
    match: any = {
        ctTeam: '',
        ctTeamScore: 0,
        tTeam: '',
        tTeamScore: 0
    };
    winningTeam: string;
    loosingTeam: string;
    winningTeamScore: number = 0;
    loosingTeamScore: number = 0;
    winningTeamLogo: string = "../../assets/navi_logo.svg";
    loosingTeamLogo: string = "../../assets/vitality_logo.svg"

    constructor(http: HttpClient) {
        this.http = http;
    }

    async ngOnInit() {
        await this.getGameHighlights()
        await this.getGameScore()
        this.message = (this.highlights as Highlights).message
    }

    async getGameHighlights() {
        await this.http.get('http://localhost:3012/highlights').subscribe(response => {
            this.highlights = response;
        })

    }

    getGameScore() {
        this.match = this.http.get('http://localhost:3012/match').subscribe(response => {
            this.match = response;
            const ct = Number.parseInt(this.match.ctTeamScore)
            const t =  Number.parseInt(this.match.tTeamScore )
            if(this.match){
                
                if (ct > t) {
                    this.winningTeam = this.match.ctTeam
                    this.loosingTeam = this.match.tTeam
                    this.winningTeamScore = this.match.ctTeamScore
                    this.loosingTeamScore = this.match.tTeamScore
                } else {
                    this.winningTeam = this.match.tTeam
                    this.loosingTeam = this.match.ctTeam
                    this.winningTeamScore = this.match.tTeamScore
                    this.loosingTeamScore = this.match.ctTeamScore
                }
        
                const winningTeamPattern = new RegExp(/navi.+/i)
        
                const teamWon = winningTeamPattern.test(this.winningTeam)
        
                if (teamWon) {
                    this.winningTeamLogo = "../../assets/navi_logo.svg"
                    this.loosingTeamLogo = "../../assets/vitality_logo.svg"
                } {
                    this.winningTeamLogo = "../../assets/vitality_logo.svg"
                    this.loosingTeamLogo = "../../assets/navi_logo.svg"
                }
            }
            
        });
    }



}

export interface Highlights {
    message: string[]
}

export interface MatchScore {
    ctTeam: string,
    ctTeamScore: number,
    tTeam: string,
    tTeamScore: number
}


