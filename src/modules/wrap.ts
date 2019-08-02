import { isUgen, Ugen } from '../gen';

export function wrap(
  a: number | Ugen,
  min: number | Ugen = 0,
  max: number | Ugen = 1
): Ugen {
  return ({declare, every, code}) => {
    const [out] = declare(a);
    let diff;

    if (min === 0) {
      diff = max;
    } else if (isUgen(min) || isUgen(max)) {
      diff = code.memoize`(${max} - ${min})`;
    } else {
      diff = <number>max - <number>min;
    }

    every(1, code`
      ${out} = ${a};
      if( ${out} < ${min} ) ${out} += ${diff}
      else if( ${out} > ${max} ) ${out} -= ${diff}
    `);

    return out;
  }
}
