import { Ugen } from './ugen';

export function input(name: string): Ugen {
  return gen => {
    return 'input';
  }
}
