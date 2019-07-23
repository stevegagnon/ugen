import { Ugen } from '../ugen';
import { lt } from './comparison';
import { accum } from './accum';
import { div } from './arithmetic';

export function train(
  frequency: number | Ugen = 440,
  pulsewidth: number | Ugen = .5
): Ugen {
  return gen => {
    return lt(accum(div(frequency, 44100)), pulsewidth);
  }
}
