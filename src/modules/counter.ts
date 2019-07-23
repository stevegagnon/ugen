import { Ugen } from '../ugen';

export function counter(
  increment: number | Ugen = 1,
  min: number | Ugen = 0,
  max: number | Ugen = 1,
  reset: number | Ugen = 0,
  { initialValue = null }: { initialValue?: number } = {}
) {
  return gen => {
    const [_increment, _reset, _min, _max] = gen.prepare(increment, reset, min, max);
    const [_accumulator] = gen.declare(initialValue || _min);

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
