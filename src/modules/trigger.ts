import { Ugen } from './ugen';

export function trigger(name: string): Ugen {
  return gen => {
    return gen.trigger(name);
  }
}
