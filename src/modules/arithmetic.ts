import { Ugen } from '../gen';

function fn(op: string, reducer: (a: number, b: number) => number) {
  return (...args: (number | Ugen)[]): Ugen => {
    return gen => {
      const _inputs = gen.prepare(...args);
      let reduced = null;
      const filtered = _inputs.filter(v => {
        if (!isNaN(v)) {
          reduced = reduced === null ? v : reducer(reduced, v);
          return false;
        }
        return true;
      });
      if (reduced !== null) {
        filtered.push(reduced);
      }
      return `( ${filtered.join(` ${op} `)} )`;
    }
  };
}

export const add = fn('+', (a, b) => a + b);
export const div = fn('/', (a, b) => a / b);
export const mul = fn('*', (a, b) => a * b);
export const sub = fn('-', (a, b) => a - b);
export const mod = fn('%', (a, b) => a % b);
