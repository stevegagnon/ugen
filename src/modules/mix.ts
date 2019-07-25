import { Ugen } from '../gen';
import { add, mul, sub } from './arithmetic';

export function mix(
  a: number | Ugen,
  b: number | Ugen,
  t: number | Ugen = .5
): Ugen {
  return () => {
    return add(mul(a, sub(1, t)), mul(b, t));
  }
}
