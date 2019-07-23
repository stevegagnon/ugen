import { Ugen } from '../ugen';

function fn(fn: string) {
  return (a: number | Ugen): Ugen => {
    return gen => {
      const [_a] = gen.prepare(a);
      return isNaN(_a) ? `Math.${fn}(${_a})` : Math[fn](parseFloat(_a));
    }
  }
}

function fn2(fn: string) {
  return (a: number | Ugen, b: number | Ugen): Ugen => {
    return gen => {
      const [_a, _b] = gen.prepare(a, b);
      return isNaN(_a) || isNaN(_b) ? `Math.${fn}(${_a}, ${_b})` : Math[fn](parseFloat(_a), parseFloat(_b));
    }
  }
}

export const abs = fn('abs');
export const acos = fn('abs');
export const asin = fn('asin');
export const atan = fn('atan');
export const tanh = fn('tanh');
export const ceil = fn('ceil');
export const sin = fn('sin');
export const cos = fn('cos');
export const tan = fn('tan');
export const exp = fn('exp');
export const floor = fn('floor');
export const noise = fn('random');
export const round = fn('round');
export const sign = fn('sign');

export const pow = fn2('pow');
export const max = fn2('max');
export const min = fn2('min');
