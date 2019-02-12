import { lt } from './comparison';
import { accum } from './accum';
import { div } from './arithmetic';

export function train(frequency = 440, pulsewidth = .5) {
  return gen => {
    return lt(accum(div(frequency, 44100)), pulsewidth);
  }
}
