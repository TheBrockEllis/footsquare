import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, AlertController, reorderArray } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';

import { HomePage } from '../home/home';
import { GamePlayerSelectPage } from '../game-player-select/game-player-select';
import { GameTimerPage } from '../game-timer/game-timer';

@Component({
  selector: 'page-game-play',
  templateUrl: 'game-play.html'
})
export class GamePlayPage {
  public gamePlayers = [];
  public activePlayers = [];
  public moves = [];
  public pendingMove:{killer?:string, killerIndex?:number, killed?:string, killedIndex?:number, method?:string} = {};

  public elimination:boolean = false;
  public regularSeason:boolean = true;

  public time:number = 0;
  public currentTime:number = 0;
  public timeRemaining:string = "100%";

  public game:{
    date?:string,
    players?:Array<string>,
    moves?:Array<any>
  } = {};

  constructor(public nav:NavController, public storage:Storage, public modal:ModalController, public alert:AlertController, public popover:PopoverController) {}

  ionViewDidLoad() {
    // TEMPORARY - DELETE WHEN DONE
    this.storage.get('players').then( (data:any) => {
      this.gamePlayers = data;
      this.game['players'] = data;
      this.setActivePlayers();
    });

    //console.log('ionViewDidLoad GameSetupPage');
  }

  displayPlayerSelect(){
    let playerModal = this.modal.create(GamePlayerSelectPage, { gamePlayers: this.gamePlayers });

    playerModal.onDidDismiss(data => {
      //console.log(data);
      this.gamePlayers = data;
      this.game['players'] = data;
      this.setActivePlayers();
    });

    playerModal.present();
  }

  displayTimer($event){
    let popover = this.popover.create(GameTimerPage);
    popover.present({
      ev: $event
    });

    popover.onDidDismiss( (time:number) => {

      // we'll get back a number of minutes, so multiply by 60 to number of seconds
      this.time = time * 60;
      this.currentTime = time * 60;
      //console.log("Time and currentTime set to: ", time*60);

      var timer = Observable.timer(1000, 1000);
      timer
      .takeWhile( () => this.regularSeason )
      .subscribe(tick => {
        //remove one second from the current time
        this.currentTime = this.currentTime - 1;

        //get the perentage of currentTime to total title
        let timeRemaining = (this.currentTime / this.time) * 100;

        if(timeRemaining <= 0) { this.presentTimeout(); }

        this.timeRemaining = timeRemaining + "%";
        //console.log("Time remaining: ", this.timeRemaining);
      });

    });
  }

  presentTimeout(){
    this.regularSeason = false;

    let alert = this.alert.create({
      title: 'ELIMINATION!',
      subTitle: 'If you die, you\'re out for good!',
      buttons: [{
        text: 'Begin!',
        handler: data => {
          //console.log('Elimination started');
          this.elimination = true;
        }
      }]
    });
    alert.present();
  }

  setActivePlayers(){
    this.activePlayers = [];
    for(let i=3; i > -1; i--){
      let player = this.gamePlayers[i];
      this.activePlayers.push(player);
    }
  }

  reorderPlayers(indexes){
    this.gamePlayers = reorderArray(this.gamePlayers, indexes);
    //console.log(this.gamePlayers);
    this.setActivePlayers();
  }

  collectMoveData(event){
    //console.log("Move Data event: ", event);

    //TODO find better way to target this tap-- need to make players name larger!
    // Click on the player's name to make things happen!
    if(event.target.className != "square-player") return;

    let player = event.target.innerHTML;
    //console.log(player);
    // if we have a killer, then this tap is the killed
    if(this.pendingMove['killer']){
      //highlight the square in red
      event.target.parentNode.classList.add('killed');
      this.pendingMove['killed'] = player;
      this.pendingMove['killedIndex'] = this.findPlayerIndex(player);
    }else{
      //highlight the square in green
      event.target.parentNode.classList.add('killer');
      this.pendingMove['killer'] = player;
      this.pendingMove['killerIndex'] = this.findPlayerIndex(player);
    }
  }

  addMove(){
    //console.log(this.pendingMove);
    this.moves.push(this.pendingMove);

    // If the killer gets to move up, move him up
    // Using the 'less than' symbol because a lower index is a higher square
    if(this.pendingMove.killedIndex < this.pendingMove.killerIndex){
      //console.log("Killer is moving up!");

      // remove the killer from their old position
      this.gamePlayers.splice(this.findPlayerIndex(this.pendingMove.killer), 1);

      //console.log(this.gamePlayers);

      //remove the killed player and add the killer in their position!
      this.gamePlayers.splice(this.findPlayerIndex(this.pendingMove.killed), 1, this.pendingMove.killer);

      //console.log(this.gamePlayers);
    }else{
      // Just remove the killed player from the court
      this.gamePlayers.splice(this.findPlayerIndex(this.pendingMove.killed), 1);
    }

    //add the killed player to the end of the array
    this.gamePlayers.push(this.pendingMove.killed);

    //set the active 4 players, reset the pendingMove, and clear colors from app court
    this.setActivePlayers();
    this.clearSquares();
    this.pendingMove = {};

    //console.log("Final state: ", this.gamePlayers);

  }

  cancelMove(){
    this.clearSquares();
    this.pendingMove = {};
  }

  clearSquares(){
    //find all squares and remove classes from them
    var squares = document.getElementsByClassName("square");
    for(let i=0; i < squares.length; i++){
      let square = squares[i];
      square.classList.remove("killed");
      square.classList.remove("killer");
    }
  }

  findPlayerIndex(name){
    return this.gamePlayers.indexOf(name);
  }

  endGame(){

    // only save this game is moves have taken place
    if(this.moves.length > 0){
      this.game['moves'] = this.moves;
      this.game['date'] = new Date().toString();

      this.storage.get('games').then( (games:any) => {
        if(!games) games = [];

        games.push(this.game);
        this.storage.set('games', games);
      });
    }

    alert('END GAME');

    this.nav.setRoot(HomePage);
  }

}
