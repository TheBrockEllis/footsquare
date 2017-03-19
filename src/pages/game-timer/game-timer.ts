import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-game-timer',
  templateUrl: 'game-timer.html'
})
export class GameTimerPage {
  public timer:number;
  public started:boolean = false;

  constructor(public nav:NavController, public view:ViewController) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GameTimerPage');
  }

  startTimer(){
    this.started = true;
    this.view.dismiss(this.timer);
  }

}
