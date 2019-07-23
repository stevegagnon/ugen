import { Ugen } from '../ugen';

export function and(...args: (number | Ugen)[]): Ugen {
  return gen => {
    const [_a, _b] = gen.prepare(...args);
    return `((${_a} !== 0 && ${_b} !== 0) | 0)`;
  }
}

export function bool(arg: number | Ugen): Ugen {
  return gen => {
    const [_input] = gen.prepare(arg);
    return `(${_input} === 0 ? 0 : 1)`;
  }
}

export function not(arg: number | Ugen): Ugen {
  return gen => {
    const [_input] = gen.prepare(arg);
    return `(${_input} === 0 ? 1 : 0)`;
  }
}
