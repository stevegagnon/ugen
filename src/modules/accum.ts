import { isUgen, Ugen } from '../gen';

export function accum(
  increment: number | Ugen = 1,
  reset: number | Ugen = 1,
  { min = 0, max = 1, initialValue }: { min?: number, max?: number, initialValue?: number } = {}
): Ugen {
  return ({ declare, every, code }) => {
    const [accumulator] = declare(initialValue || min);

    const wrap = increment > 0
      ? code`
        if (${accumulator} > ${max}) {
          ${accumulator} -= ${max - min};
        }
      `
      : code`
        if (${accumulator} < ${min}) {
          ${accumulator} += ${max - min};
        }
      `;

    if (isUgen(reset) || reset) {
      every(1, code`
      if (${reset}) { ${accumulator} = ${min} } else {
      ${accumulator} += ${increment};
      ${wrap}
      }
    `);
    } else {
      every(1, code`
      ${accumulator} += ${increment};
      ${wrap}
    `);
    }

    return accumulator;
  }
}
