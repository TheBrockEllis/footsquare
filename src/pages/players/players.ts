import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage {
  public players:Array<string> = [];

  constructor(public nav:NavController, public storage:Storage, public alert:AlertController) {}

  ionViewDidLoad() {
    this.loadPlayers();

    console.log('ionViewDidLoad PlayersPage');
  }

  loadPlayers(){
    this.storage.get('players').then( (players:Array<string>) => {
      if(players) this.players = players;
    });
  }

  savePlayers(){
    this.storage.set('players', this.players);
  }

  addPlayer(name:string){
    console.log(this.players);
    this.players.push(name);
    this.savePlayers();
  }

  removePlayer(name){
    let confirm = this.alert.create({
      title: 'Remove this player??',
      message: "Do you really want to get rid of this player?? :'-(",
      buttons: [
        {
          text: 'Nooooo!!!!!',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yup',
          handler: () => {
            this.players.splice( this.players.indexOf(name), 1);
            this.savePlayers();
          }
        }
      ]
    });
    confirm.present();
  }

  displayAddPlayer(){
    let prompt = this.alert.create({
      title: 'Add Player',
      message: "Enter the name of the new player",
      inputs: [{
        name: 'name',
        placeholder: 'Michael Scott'
      }],
      buttons: [{
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          this.addPlayer(data.name);
        }
      }]
    });
    prompt.present();
  }

}
