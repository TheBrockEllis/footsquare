import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, AlertController, ToastController, reorderArray } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

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

  public scores:any = {};

  public shouldTime:boolean = true;
  public time:number = 0;
  public timer:any;
  public currentTime:number = 0;
  public timeRemaining:string = "100%";

  public game:{
    date?:string,
    players?:Array<string>,
    moves?:Array<any>
  } = {};

  constructor(public nav:NavController, public storage:Storage, public modal:ModalController, public alert:AlertController, public popover:PopoverController, public toast:ToastController) {}

  ionViewDidLoad() {
    // TEMPORARY - DELETE WHEN DONE
    // this.storage.get('players').then( (data:any) => {
    //   this.gamePlayers = data;
    //
    //   //deepCopy makes a new copy of the data so it's not passed by reference
    //   this.game['players'] = this.deepCopy(data);
    //
    //   this.setActivePlayers();
    // });
  }

  ionViewDidLeave(){
    if(this.timer) {
      console.log(this.timer);
      this.timer.unsubscribe();
    }
  }

  displayPlayerSelect(){
    let playerModal = this.modal.create(GamePlayerSelectPage, { gamePlayers: this.gamePlayers });

    playerModal.onDidDismiss(data => {
      //console.log(data);
      this.gamePlayers = data;

      this.initScores();

      //deepCopy makes a new copy of the data so it's not passed by reference
      this.game['players'] = this.deepCopy(data);

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

      if(!time) return;

      //console.log("time was returned");

      let toast = this.toast.create({
        message: 'Timer started!',
        duration: 3000
      });
      toast.present();

      // we'll get back a number of minutes, so multiply by 60 to number of seconds
      this.time = time * 60;
      this.currentTime = time * 60;
      //console.log("Time and currentTime set to: ", time*60);

      this.timer = Observable.timer(1000, 1000);
      this.timer
      .takeWhile( () => this.shouldTime )
      .subscribe(tick => {
        //remove one second from the current time
        this.currentTime = this.currentTime - 1;

        //get the perentage of currentTime to total title
        let timeRemaining = (this.currentTime / this.time) * 100;

        if(timeRemaining <= 0) { this.presentElimination(); }

        this.timeRemaining = timeRemaining + "%";
        //console.log("Time remaining: ", this.timeRemaining);
      });

    });
  }

  initScores(){
    this.gamePlayers.forEach( (player) => {
      if(!this.scores[player]) this.scores[player] = 0;
    });

    console.log("Scores init'd: ", this.scores);
  }

  presentElimination(){
    this.shouldTime = false;

    let alert = this.alert.create({
      title: 'ELIMINATION!',
      subTitle: 'If you die, you\'re out for good!',
      buttons: [{
        text: 'Begin!',
        handler: data => {
          this.elimination = true;
        }
      }]
    });
    alert.present();
  }

  setActivePlayers(){
    this.activePlayers = [];

    let limit = 3;
    //if(this.gamePlayers.length < 3) limit = this.gamePlayers.length + 1;

    // showdown should be index 2 and 3 (squares 3 and 4)

    //console.log("Using limit ", limit);

    for(let i=limit; i > -1; i--){
      let player = this.gamePlayers[i];
      //if(player) this.activePlayers.push(player);
      if(!player) player = ''; // set empty player to preserve spacing
      this.activePlayers.push(player);
    }

    //console.log(this.activePlayers.length);

    // if we're in elimination and we've only got one player left, they're the winner!
    if(this.elimination){
      if(this.gamePlayers.length == 4){
        let toast = this.toast.create({
          message: 'Final four!',
          duration: 3000
        });
        toast.present();
      }

      if(this.gamePlayers.length == 2){
        let toast = this.toast.create({
          message: 'The Showdown!',
          duration: 3000
        });
        toast.present();
      }

      if(this.gamePlayers.length == 1){
        this.processEndGame();
      }
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
    // if we don't have all the needed data, just return
    if(!this.pendingMove.killer || !this.pendingMove.killed) return;

    // SCORES: give 1 point to all players who haven't been killed
    this.activePlayers.forEach( (player) => {
      if(player != this.pendingMove.killed){
        this.scores[player]++;
      }
    });

    console.log("Updated Scores: ", this.scores);

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

    // if we're just playing normally, add the dead player to end of the list
    if(!this.elimination && this.shouldTime){
      this.gamePlayers.push(this.pendingMove.killed);
    }

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

    let confirm = this.alert.create({
     title: 'Are you sure?',
     message: 'You will not be able to make any additional changes to this game once it is ended.',
     buttons: [
       {text: 'No'},
       {
         text: 'Yes',
         handler: () => {
           this.processEndGame();
           //console.log('Agree clicked');
         }
       }
     ]
   });
   confirm.present();
  }

  processEndGame(){
    // only save this game is moves have taken place
    if(this.moves && this.moves.length > 0){
      console.log("Reported game players: ", this.game['players']);

      this.game['moves'] = this.moves;
      this.game['date'] = moment().format('YYYY-MM-DD HH:mm');
      this.game['scores'] = this.scores;

      this.storage.get('games').then( (games:any) => {
        if(!games) games = [];

        games.push(this.game);
        this.storage.set('games', games);
      });
    }

    if(this.gamePlayers && this.gamePlayers.length == 1){
      let alert = this.alert.create({
        title: 'Congratulations!',
        subTitle: `${this.gamePlayers[0]} is the last man standing!`,
        buttons: ['End game']
      });
      alert.present();
    }

    // turn the timer off if we're leaving the game mid-way and the timer Observable is still running
    this.shouldTime = false;

    this.nav.setRoot(HomePage);
  }

  /**
   * Returns a deep copy of the object
   */
  deepCopy(oldObj: any) {
      var newObj = oldObj;
      if (oldObj && typeof oldObj === "object") {
          newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
          for (var i in oldObj) {
              newObj[i] = this.deepCopy(oldObj[i]);
          }
      }
      return newObj;
  }

}
