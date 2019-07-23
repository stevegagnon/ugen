import { Ugen } from '../ugen';

export function mstosamps(ms: number | Ugen): Ugen {
  return gen => {
    const [_ms] = gen.prepare(ms);
    if (isNaN(_ms)) {
      const [_samps] = gen.declare(`${gen.samplerate} / 1000 * ${_ms}`);
      return _samps;
    } else {
      return gen.samplerate / 1000 * _ms;
    }
  }
}
