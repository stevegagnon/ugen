import { isUgen, Ugen } from '../gen';

export function t60(a: number | Ugen): Ugen {
  return ({ code }) => {
    if (isUgen(a)) {
      return code`Math.exp( -6.907755278921 / ${a} )`;
    } else {
      return Math.exp(-6.907755278921 / <number>a);
    }
  }
}
