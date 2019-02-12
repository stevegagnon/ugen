
export function mstosamps(ms) {
  return gen => {
    const [_ms] = gen.prepare(ms);
    if (isNaN(_ms)) {
      const [_samps] = gen.lets(`${gen.samplerate} / 1000 * ${_ms}`);
      return _samps;
    } else {
      return gen.samplerate / 1000 * _ms;
    }
  }
}
