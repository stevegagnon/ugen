
export function ssd(initial = 0) {
  let _stored = 0;
  return {
    in: (sample) => {
      return gen => {
        const [_sample] = gen.prepare(sample);
        if (!_stored) {
          _stored = gen.lets(initial);
        }
        gen.every(1, `${_stored} = ${_sample}`);
      };
    },
    out: {
      get() {
        return gen => {
          if (!_stored) {
            _stored = gen.lets(initial);
          }
          return _stored;
        };
      }
    }
  }
}
