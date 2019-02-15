function fn1(op) {
  return (...args) => {
    return gen => {
      const [_a, _b] = gen.prepare(...args);
      return `((${_a} ${op} ${_b}) | 0)`;
    }
  }
}

function fn2(op) {
  return (...args) => {
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
