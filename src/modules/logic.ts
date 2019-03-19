import { Ugen } from './ugen';

export function and(...args: Array<Ugen | number>): Ugen {
  return gen => {
    const [_a, _b] = gen.prepare(...args);
    return `((${_a} !== 0 && ${_b} !== 0) | 0)`;
  }
}

export function bool(arg: Ugen | number): Ugen {
  return gen => {
    const [_input] = gen.prepare(arg);
    return `(${_input} === 0 ? 0 : 1)`;
  }
}

export function not(arg: Ugen | number): Ugen {
  return gen => {
    const [_input] = gen.prepare(arg);
    return `(${_input} === 0 ? 1 : 0)`;
  }
}
