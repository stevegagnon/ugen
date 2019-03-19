import { Ugen } from './ugen';
import { add, mul, sub } from './arithmetic';

export function mix(
  a: Ugen | number,
  b: Ugen | number,
  t: Ugen | number = .5
): Ugen {
  return gen => {
    return add(mul(a, sub(1, t)), mul(b, t));
  }
}
