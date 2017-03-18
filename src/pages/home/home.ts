import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlayersPage } from '../players/players';
import { GamesPage } from '../games/games';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public nav:NavController) {

  }

  viewPlayers(){
    this.nav.push(PlayersPage);
  }

  viewGames(){
    this.nav.push(GamesPage);
  }

}
