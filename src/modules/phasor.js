
import { accum } from './accum';
import { mul, div } from './arithmetic';

export function phasor(frequency = 1, reset = 0, { min = 0, max = 1 }) {
  return gen => {
    const range = max - min;
    return typeof frequency === 'number'
      ? accum((frequency * range) / gen.samplerate, reset, props)
      : accum(
        div(
          mul(frequency, range),
          gen.samplerate
        ),
        reset, props
      );
  }
}
