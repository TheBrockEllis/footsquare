import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { PrettyTime } from '../pipes/pretty-time';
import { Randomize } from '../pipes/randomize';
import { PlayerSquare } from '../pipes/player-square';
import { Reverse } from '../pipes/reverse';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PlayersPage } from '../pages/players/players';
import { GamesPage } from '../pages/games/games';
import { GamePlayPage } from '../pages/game-play/game-play';
import { GamePage } from '../pages/game/game';
import { GamePlayerSelectPage } from '../pages/game-player-select/game-player-select';
import { GameTimerPage } from '../pages/game-timer/game-timer';
import { RulesPage } from '../pages/rules/rules';
import { TutorialsPage } from '../pages/tutorials/tutorials';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlayersPage,
    GamesPage,
    GamePlayPage,
    GamePage,
    GamePlayerSelectPage,
    GameTimerPage,
    RulesPage,
    TutorialsPage,
    PrettyTime,
    Randomize,
    PlayerSquare,
    Reverse
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlayersPage,
    GamesPage,
    GamePlayPage,
    GamePage,
    GamePlayerSelectPage,
    GameTimerPage,
    RulesPage,
    TutorialsPage
  ],
  providers: [Storage, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
