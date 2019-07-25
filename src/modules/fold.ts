import { Ugen } from '../gen';

export function fold(
  a: number | Ugen,
  min: number | Ugen,
  max: number | Ugen
): Ugen {
  return ({ declare, every, code }) => {
    const [value, range, numWraps] = declare(a, code`${max} - ${min}`, 0);

    every(1, code`
      if(${value} >= ${max}){
        ${value} -= ${range}
        if(${value} >= ${max}){
          ${numWraps} = ((${value} - ${min}) / ${range}) | 0
          ${value} -= ${range} * ${numWraps}
        }
        ${numWraps}++
      } else if(${value} < ${min}){
        ${value} += ${range}
        if(${value} < ${min}){
          ${numWraps} = ((${value} - ${min}) / ${range}- 1) | 0
          ${value} -= ${range} * ${numWraps}
        }
        ${numWraps}--
      }
      if(${numWraps} & 1) ${value} = ${max} + ${min} - ${value}
    `);

    return value;
  }
}
