
export function mtof(m, { tuning = 440 }) {
  return gen => {
    const [_m] = gen.prepare(m);
    if (isNaN(_m)) {
      const [_f] = gen.lets(`( ${tuning} * Math.exp( .057762265 * (${_m} - 69) ) )`);
      return _f;
    } else {
      return tuning * Math.exp(.057762265 * (inputs[0] - 69));
    }
  }
}
