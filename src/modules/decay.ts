import { Ugen } from '../gen';
import { mul } from './arithmetic';
import { t60 } from './t60';

export function decay(trigger, decayTime = 44100): Ugen {
  return ({ declare, every, code }) => {
    const [v] = declare(1);
    every(1, code`${v} = ${mul(v, t60(decayTime))}`);
    trigger.on(`${v} = 1`);
    return v;
  }
}
