import { Ugen } from '../ugen';

function fn1(op: string) {
  return (...args: (number | Ugen)[]): Ugen => {
    return gen => {
      const [_a, _b] = gen.prepare(...args);
      return `((${_a} ${op} ${_b}) | 0)`;
    }
  }
}

function fn2(op: string) {
  return (...args: (number | Ugen)[]): Ugen => {
    return gen => {
      const [_a, _b] = gen.prepare(...args);
      return `(${_a} ${op} ${_b} ? ${_a} : 0)`;
    }
  }
}

export const eq = fn1('===');
export const neq = fn1('!==');
export const gt = fn1('>');
export const lt = fn1('<');
export const lte = fn1('<=');

export const gtp = fn2('>=');
export const ltp = fn2('<=');
