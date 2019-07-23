import { Ugen } from '../ugen';
import { mul, sub } from './arithmetic';
import { t60 } from './t60';

export function attack(trigger, decayTime: number = 44100): Ugen {
  return gen => {
    const [_v] = gen.declare(1);
    gen.every(1, `${_v} = ${mul(_v, t60(decayTime))}`);
    trigger.on(`${_v} = 1`);
    return sub(1, _v);
  }
}
