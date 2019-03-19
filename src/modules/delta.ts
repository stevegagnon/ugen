import { Ugen } from './ugen';
import { ssd } from './ssd';
import { sub } from './arithmetic';

export function delta(a: Ugen | number): Ugen {
  return gen => {
    return sub(a, ssd(a));
  }
}