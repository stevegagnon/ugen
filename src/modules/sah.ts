import { Ugen } from '../gen';

export function sah(
  sample: number | Ugen,
  control: number | Ugen,
  threshold: number | Ugen = 0
): Ugen {
  return ({ declare, code, every }) => {
    const [held, previous_control] = declare(sample, threshold);

    every(1, code`
      if (${control} > ${threshold} && ${previous_control} <= ${threshold}) {
        ${held} = ${sample};
      }
      ${previous_control} = ${control};
    `);

    return held;
  }
}
