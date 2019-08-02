import { Ugen } from '../gen';

export function play(
  ugen: Ugen
): Ugen {
  return ({ output, code, every }) => {
    every(1, code`
      ${output} = ${ugen};
    `);
  }
}
