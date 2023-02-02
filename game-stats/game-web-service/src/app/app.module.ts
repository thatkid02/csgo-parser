import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { RoundStatsComponent } from './round-stats/round-stats.component';
import { PlayerComponent } from './player/player.component';


@NgModule({
  declarations: [
    AppComponent, GameStatsComponent, PlayerStatsComponent, RoundStatsComponent, PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
