import { Ugen } from './ugen';

export function clamp(
  a: Ugen | number,
  min: Ugen | number = -1,
  max: Ugen | number = 1
): Ugen {
  return gen => {
    const [_a, _min, _max] = gen.prepare(a, min, max);
    const [_out] = gen.declare(_a);

    gen.every(1, `
      ${_out} = ${_a};
      if( ${_out} > ${_max} ) ${_out} = ${_max}
      else if( ${_out} < ${_min} ) ${_out} = ${_min}
    `);

    return _out;
  }
}
