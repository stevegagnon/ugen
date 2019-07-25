import { Ugen } from '../gen';

export function counter(
  increment: number | Ugen = 1,
  min: number | Ugen = 0,
  max: number | Ugen = 1,
  reset: number | Ugen = 0,
  { initialValue = null }: { initialValue?: number } = {}
) {
  return ({ declare, code, every }) => {
    const [accumulator] = declare(initialValue || min);

    const wrap = increment > 0
      ? code`
        if (${accumulator} > ${max}) {
          ${accumulator} -= ${max} - ${min};
        }
      `
      : code`
        if (${accumulator} < ${min}) {
          ${accumulator} += ${max} - ${min};
        }
      `;

    every(1, code`
      if (${reset}) { ${accumulator} = ${min} }
      else {
        ${accumulator} += ${increment};
        ${wrap}
      }
    `);

    return accumulator;
  }
}
