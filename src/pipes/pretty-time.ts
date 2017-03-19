import { Injectable, Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'prettyTime'
})
@Injectable()
export class PrettyTime {
  transform(value, args?:Array<any>) {
    let time = moment(value).fromNow();
    return time;
  }
}
