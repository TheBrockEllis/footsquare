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
    console.log('ionViewDidLoad GamePlayerSelectPage');
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
    console.log("Adding player", player);
    this.gamePlayers.push(player);
  }

  removePlayer(index){
    console.log("Removing player at index ", index);

    this.gamePlayers.splice(index, 1);
  }

  dismiss() {
    this.view.dismiss(this.gamePlayers);
  }

}
