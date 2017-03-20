import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'playerSquare'
})
@Injectable()
export class PlayerSquare {
  /*
    Takes a player and their index and if the index is in the field of play, prepends the square # to their name.
  */
  transform(value:string, index:number) {
    if(index <= 3){
      switch(index){

        case 3:
          value = "1 - " + value;
          break;

        case 2:
          value = "2 - " + value;
          break;

        case 1:
          value = "3 - " + value;
          break;

        case 0:
          value = "4 - " + value;
          break;
      }
    }

    return value;
  }
}
