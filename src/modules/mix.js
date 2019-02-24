
import { add, mul, sub } from './arithmetic';

export function mix(a, b, t = .5) {
  return gen => {
    return add(mul(a, sub(1, t)), mul(b, t));
  }
}
