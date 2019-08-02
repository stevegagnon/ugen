import { Ugen } from '../gen';

export function and([a, b]: (number | Ugen)[]): Ugen {
  return ({ code }) => {
    return code.memoize`((${a} !== 0 && ${b} !== 0) | 0)`;
  }
}

export function bool(input: number | Ugen): Ugen {
  return ({ code }) => {
    return code.memoize`(${input} === 0 ? 0 : 1)`;
  }
}

export function not(input: number | Ugen): Ugen {
  return ({ code }) => {
    return code.memoize`(${input} === 0 ? 1 : 0)`;
  }
}
