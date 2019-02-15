
export function counter(increment = 1, min = 0, max = 1, reset = 0, { initialValue = null } = {}) {
  return gen => {
    const [_increment, _reset, _min, _max] = gen.prepare(increment, reset, min, max);
    const [_accumulator] = gen.lets(initialValue || _min);

    const wrap = increment > 0 ? `
      if (${_accumulator} > ${_max}) {
        ${_accumulator} -= ${_max} - ${_min};
      }
    ` : `
      if (${_accumulator} < ${_min}) {
        ${_accumulator} += ${_max} - ${_min};
      }
    `;

    gen.every(1, `
      if (${_reset}) { ${_accumulator} = ${_min} }
      else {
        ${_accumulator} += ${_increment};
        ${wrap}
      }
    `);

    return accumulator;
  }
}
