import { isUgen, Ugen } from '../gen';

export function mstosamps(ms: number | Ugen): Ugen {
  return ({ samplerate, code }) => {
    if (isUgen(ms)) {
      return code`${samplerate} / 1000 * ${ms}`;
    } else {
      return samplerate / 1000 * <number>ms;
    }
  }
}
