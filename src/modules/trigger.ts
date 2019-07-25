import { Ugen } from '../gen';

export function trigger(name: string): Ugen {
  return ({ trigger }) => {
    return trigger(name);
  }
}
