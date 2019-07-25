import { Ugen } from '../gen';

export function input(name: string): Ugen {
  return ({ input }) => {
    return input;
  }
}
