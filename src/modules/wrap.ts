import { Ugen } from './ugen';

export function wrap(
  a: Ugen | number,
  min: Ugen | number = 0,
  max: Ugen | number = 1
): Ugen {
  return gen => {
    const [_a, _min, _max] = gen.prepare(a, min, max);
    const [_out] = gen.declare(_a);
    let _diff;

    if (min === 0) {
      _diff = _max;
    } else if (isNaN(_min) || isNaN(_max)) {
      _diff = `(${_max} - ${_min})`;
    } else {
      _diff = _max - _min;
    }

    gen.every(1, `
      ${_out} = ${_a};
      if( ${_out} < ${_min} ) ${_out} += ${_diff}
      else if( ${_out} > ${_max} ) ${_out} -= ${diff}
    `);

    return _out;
  }
}
