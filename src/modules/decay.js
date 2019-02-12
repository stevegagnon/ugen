import { ssd } from './ssd';
import { mul } from './arithmetic';
import { t60 } from './t60';

export function decay(trigger, decayTime = 44100) {
  return gen => {
    const v = ssd(1);
    v.in(mul(v.out, t60(decayTime)));
    trigger.on(v.in(1))
    return v.out;
  }
}
