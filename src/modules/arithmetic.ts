import { isUgen, Ugen } from '../gen';

function fn(op: string, reducer: (a: number, b: number) => number) {
  return (...args: (number | Ugen)[]): Ugen => {
    return ({ code, join }) => {
      let reduced = null;
      const filtered = args.filter(v => {
        if (!isUgen(v)) {
          reduced = reduced === null ? v : reducer(reduced, <number>v);
          return false;
        }
        return true;
      });
      if (reduced !== null) {
        filtered.push(reduced);
      }
      //console.log(args, filtered);
      
      return code.memoize`( ${join(op, ...filtered)} )`;
    }
  };
}

export const add = fn('+', (a, b) => a + b);
export const div = fn('/', (a, b) => a / b);
export const mul = fn('*', (a, b) => a * b);
export const sub = fn('-', (a, b) => a - b);
export const mod = fn('%', (a, b) => a % b);
