import { ssd } from './ssd';
import { mul, sub } from './arithmetic';
import { t60 } from './t60';

export function attack(trigger, decayTime = 44100) {
  return gen => {
    const v = ssd(1);
    v.in(mul(v.out, t60(decayTime)))
    trigger.on(v.in(1))
    return sub(1, v.out);
  }
}
