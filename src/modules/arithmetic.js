
function fn(op) {
  return (...args) => {
    return gen => {
      const _inputs = gen.prepare(args);
      let sum = 0;
      return _inputs.filter(v => {
          if (!isNaN(v)) {
            sum += parseFloat(v);
            return false;
          }
          return true;
        })
        .push(sum)
        .join(` ${op} `);
    }
  };
}

export const add = fn('+');
export const div = fn('/');
export const mul = fn('*');
export const sub = fn('-');
export const mod = fn('%');