import { Ugen } from '../gen';

export function ssd(
  a: Ugen,
  initial: number = 0
): Ugen {
  return ({ declare, every, code }) => {
    let [stored] = declare(initial);
    every(1, code`${stored} = ${a}`);
    return stored;
  }
}
