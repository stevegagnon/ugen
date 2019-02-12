

export function fold(a, min, max) {
  return gen => {
    const [_a, _min, _max] = gen.prepare(a, min, max);
    const [_value, _range, _numWraps] = gen.every(`${_a}`, `${_max} - ${_min}`, 0);

    gen.every(1, `
      if(${_value} >= ${hi}){
        ${_value} -= ${_range}
        if(${_value} >= ${hi}){
          ${_numWraps} = ((${_value} - ${lo}) / ${_range}) | 0
          ${_value} -= ${_range} * ${_numWraps}
        }
        ${_numWraps}++
      } else if(${_value} < ${lo}){
        ${_value} += ${_range}
        if(${_value} < ${lo}){
          ${_numWraps} = ((${_value} - ${lo}) / ${_range}- 1) | 0
          ${_value} -= ${_range} * ${_numWraps}
        }
        ${_numWraps}--
      }
      if(${_numWraps} & 1) ${_value} = ${hi} + ${lo} - ${_value}
    `);

    return _value;
  }
}
