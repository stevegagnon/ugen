

export function clamp(a, min = -1, max = 1) {
  return gen => {
    const [_a, _min, _max] = gen.prepare(a, min, max);
    const [_out] = gen.lets(_a);

    gen.every(1, `
      ${_out} = ${_a};
      if( ${_out} > ${_max} ) ${_out} = ${_max}
      else if( ${_out} < ${_min} ) ${_out} = ${_min}
    `);

    return _out;
  }
}
