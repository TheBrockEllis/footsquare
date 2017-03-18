import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { GamePlayPage } from '../game-play/game-play';

@Component({
  selector: 'page-games',
  templateUrl: 'games.html'
})
export class GamesPage {
  public games:Array<{date:string, players:Array<string>, moves:Array<{killer:string, killed:string, method:string}> }> = [];

  constructor(public nav:NavController, public storage:Storage) {}

  ionViewDidLoad() {
    this.loadGames();
  }

  loadGames(){
    this.storage.get('games').then( (data:any) => {
      if(data) this.games = data;
    });
  }

  createNewGame(){
    // set this as the root page because we don't want them to be able to leave it easily
    this.nav.setRoot(GamePlayPage);
    //this.nav.push(GamePlayPage);
  }

}
