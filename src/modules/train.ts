import { Ugen } from './ugen';
import { lt } from './comparison';
import { accum } from './accum';
import { div } from './arithmetic';

export function train(
  frequency: Ugen | number = 440,
  pulsewidth: Ugen | number = .5
): Ugen {
  return gen => {
    return lt(accum(div(frequency, 44100)), pulsewidth);
  }
}
