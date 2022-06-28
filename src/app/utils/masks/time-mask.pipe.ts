import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeMask'
})
export class TimeMaskPipe implements PipeTransform {
  transform(value: string): any {
    if(value && value.length) {
      value = value.replace(/[^0-9]/g, '');
      const { length } = value;

      switch(length) {
        case 1: return value;
        case 2: return `${Number.parseInt(value.substring(0,2)) >= 24 ? 23 : value.substring(0,2)}`;
        case 3: return `${value.substring(0,2)}:${value.substring(2,3)}`;
        case 4: default: return `${value.substring(0,2)}:${Number.parseInt(value.substring(2,4)) >= 60 ? 59 : value.substring(2,4)}`;
      }
    }
    return value;
  }
}
