import { isUgen, Ugen } from '../gen';

export function mtof(
  m: number | Ugen,
  { tuning = 440 }: { tuning?: number }
): Ugen {
  return ({ code }) => {
    if (isUgen(m)) {
      return code`${tuning} * Math.exp( .057762265 * (${m} - 69) )`;
    } else {
      return tuning * Math.exp(.057762265 * (<number>m - 69));
    }
  }
}
