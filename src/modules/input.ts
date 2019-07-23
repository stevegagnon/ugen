import { Ugen } from '../gen';

export function input(name: string): Ugen {
  return gen => {
    return 'input';
  }
}
