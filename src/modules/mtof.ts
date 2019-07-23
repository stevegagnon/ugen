import { Ugen } from '../ugen';

export function mtof(
  m: number | Ugen,
  { tuning = 440 }: { tuning?: number }
): Ugen {
  return gen => {
    const [_m] = gen.prepare(m);
    if (isNaN(_m)) {
      const [_f] = gen.declare(`( ${tuning} * Math.exp( .057762265 * (${_m} - 69) ) )`);
      return _f;
    } else {
      return tuning * Math.exp(.057762265 * (_m - 69));
    }
  }
}
