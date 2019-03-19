import { Ugen } from './ugen';

export function param(
  name: string,
  initial: number
): Ugen {
  return gen => {
    const _param = gen.param(name, initial);
    return _param;
  }
}
