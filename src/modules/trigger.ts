import { Ugen } from '../gen';

export function trigger(name: string): Ugen {
  return gen => {
    return gen.trigger(name);
  }
}
