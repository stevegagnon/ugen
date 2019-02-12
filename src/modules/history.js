
export function history() {
  let _stored = 0;
  return {
    in: (sample) => {
      return gen => {
        const [_sample] = gen.prepare(sample);
        if (!_stored) {
          _stored = gen.lets(0);
        }
        gen.every(1, `${_stored} = ${_sample}`);
      };
    },
    out: {
      get() {
        return gen => {
          if (!_stored) {
            _stored = gen.lets(0);
          }
          return _stored;
        };
      }
    }
  }
}
