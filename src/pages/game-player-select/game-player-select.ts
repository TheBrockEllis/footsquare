import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-game-player-select',
  templateUrl: 'game-player-select.html'
})
export class GamePlayerSelectPage {
  public players:Array<string> = [];
  public gamePlayers:Array<string> = [];

  constructor(public nav:NavController, public view:ViewController, public params:NavParams, public storage:Storage) {}

  ionViewDidLoad() {
    this.gamePlayers = this.params.get('gamePlayers');

    this.loadPlayers();
  }

  loadPlayers(){
    this.storage.get('players').then( (data:Array<string>) => {
      if(data) this.players = data;
    });
  }

  togglePlayer(player){
    let index = this.gamePlayers.indexOf(player);
    if( index != -1 ){
      this.removePlayer(index);
    }else{
      this.addPlayer(player);
    }
  }

  addPlayer(player){
    this.gamePlayers.push(player);
  }

  removePlayer(index){
    this.gamePlayers.splice(index, 1);
  }

  addAllPlayers(){
    this.players.forEach( (player:string) => {
      // add the player if they aren't already added
      if(this.gamePlayers.indexOf(player) == -1) this.gamePlayers.push(player);
    });
  }

  dismiss() {
    this.view.dismiss(this.gamePlayers);
  }

}
