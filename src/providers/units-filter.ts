import { Pipe, PipeTransform } from '@angular/core';
/*
 * Converts Kelvin to Celsius and Fahrenheit
 * Usage:
 *   value | kelvin:unit /F/C
*/
@Pipe({name: 'tempTo'})
export class TempToPipe implements PipeTransform {
  transform(value: number, unit: string): number {
    let result = 0;
    let u = unit || 'C'; 

    if(u == 'C'){
      result = value - 273.15;
    }else if( u == 'F'){
      result = (value * (9/5)) - 459.67;
    }

    return parseInt(result.toString());
  }
}