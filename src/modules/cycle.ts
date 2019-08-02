import { Ugen } from '../gen';
import { phasor } from './phasor';

export function cycle(
  frequency: number | Ugen = 1
): Ugen {
  return phasor(frequency);
}
