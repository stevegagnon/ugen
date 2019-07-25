import { Ugen } from '../gen';

function fn1(op: string) {
  return ([a, b]: (number | Ugen)[]): Ugen => {
    return ({code}) => {
      return code`((${a} ${op} ${b}) | 0)`;
    }
  }
}

function fn2(op: string) {
  return ([a, b]: (number | Ugen)[]): Ugen => {
    return ({code}) => {
      return code`(${a} ${op} ${b} ? ${a} : 0)`;
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
