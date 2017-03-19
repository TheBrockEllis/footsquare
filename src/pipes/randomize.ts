import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'randomize'
})
@Injectable()
export class Randomize {
  /*
    Takes an array of values and returns a random one.
   */
  transform(value:Array<any>, args?:any) {
    let random = Math.floor(Math.random() * value.length);
    return value[random];
  }
}
