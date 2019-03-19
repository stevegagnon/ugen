import { Ugen } from './ugen';

export function accum(
  increment: Ugen | number = 1,
  reset: Ugen | number = 1,
  { min = 0, max = 1, initialValue }: { min?: number, max?: number, initialValue: number }
): Ugen {
  return gen => {
    const [_increment, _reset] = gen.prepare(increment, reset);
    const [_accumulator] = gen.declare(initialValue || min);

    const wrap = increment > 0 ? `
      if (${_accumulator} > ${max}) {
        ${_accumulator} -= ${max - min};
      }
    ` : `
      if (${_accumulator} < ${min}) {
        ${_accumulator} += ${max - min};
      }
    `;

    gen.every(1, `
      ${isNaN(_reset) || _reset ? `if (${_reset}) { ${_accumulator} = ${min} } else {` : ''}
      ${_accumulator} += ${_increment};
      ${wrap}
      ${isNaN(_reset) || _reset ? `}` : ''}
    `);

    return _accumulator;
  }
}
