import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {
  public game:any = {};
  public methods:Array<string> = [
    "took down",
    "killed",
    "eliminated",
    "smacked",
    "wasted",
    "scorched",
    "humiliated",
    "belittled",
    "dominated"
  ]

  constructor(public nav:NavController, public params:NavParams) {}

  ionViewDidLoad() {
    this.game = this.params.get('game');
    //console.log(this.game.scores);
  }

  method():string{
    var random = Math.floor(Math.random() * this.methods.length + 1);
    return this.methods[random];

  }

}
