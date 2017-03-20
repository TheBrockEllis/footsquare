import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlayersPage } from '../players/players';
import { GamesPage } from '../games/games';
import { GamePlayPage } from '../game-play/game-play';
import { RulesPage } from '../rules/rules';
import { TutorialsPage } from '../tutorials/tutorials';

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

  viewRules(){
    this.nav.push(RulesPage);
  }

  viewTutorials(){
    this.nav.push(TutorialsPage);
  }

  createNewGame(){
    // set this as the root page because we don't want them to be able to leave it easily
    this.nav.setRoot(GamePlayPage);
  }

}
