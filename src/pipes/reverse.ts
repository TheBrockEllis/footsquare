import { Injectable, Pipe } from '@angular/core';

@Pipe({
  name: 'reverse'
})
@Injectable()
export class Reverse {
  /*
    Takes an array and reverses it!
   */
  transform(value) {
    return value.slice().reverse();
  }
}
