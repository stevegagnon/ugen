import { Ugen } from './ugen';
import { accum } from './accum';
import { mul, div } from './arithmetic';

export function phasor(
  frequency: Ugen | number = 1,
  reset: number = 0,
  { min = 0, max = 1 }: { min?: number, max?: number } = {}
): Ugen {
  return gen => {
    const range = max - min;
    return typeof frequency === 'number'
      ? accum((frequency * range) / gen.samplerate, reset, { min, max })
      : accum(
        div(
          mul(frequency, range),
          gen.samplerate
        ),
        reset,
        { min, max }
      );
  }
}
