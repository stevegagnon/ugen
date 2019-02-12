
export function t60(a) {
  return gen => {
    const [_a] = gen.prepare(a);
    return isNaN(_a) ? `Math.exp( -6.907755278921 / ${_a} )` : Math.exp(-6.907755278921 / _a);
  }
}
