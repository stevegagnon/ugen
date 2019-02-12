
import { add, mul, sub } from './arithmetic';
import { memo } from './memo';

export function mix(a, b, t = .5) {
  return gen => {
    return memo(add(mul(a, sub(1, t)), mul(b, t)));
  }
}
