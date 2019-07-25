import { Ugen } from '../gen';

export function param(
  name: string,
  initial: number
): Ugen {
  return ({ param }) => {
    return param(name, initial);
  }
}
