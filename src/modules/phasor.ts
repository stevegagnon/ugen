import { isUgen, Ugen } from '../gen';
import { accum } from './accum';
import { mul, div } from './arithmetic';

export function phasor(
  frequency: number | Ugen = 1,
  reset: number = 0,
  { min = 0, max = 1 }: { min?: number, max?: number } = {}
): Ugen {
  return ({ samplerate }) => {
    const range = max - min;
    return isUgen(frequency)
      ? accum(
        div(
          mul(frequency, range),
          samplerate
        ),
        reset,
        { min, max }
      )
      : accum((<number>frequency * range) / samplerate, reset, { min, max });
  }
}
