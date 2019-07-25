import { Ugen } from '../gen';

export function clamp(
  a: number | Ugen,
  min: number | Ugen = -1,
  max: number | Ugen = 1
): Ugen {
  return ({declare, every, code}) => {
    const [out] = declare(a);

    every(1, code`
      ${out} = ${a};
      if( ${out} > ${max} ) ${out} = ${max}
      else if( ${out} < ${min} ) ${out} = ${min}
    `);

    return out;
  }
}
