import { Ugen } from '../gen';
import { ssd } from './ssd';
import { sub } from './arithmetic';

export function delta(a: Ugen): Ugen {
  return () => {
    return sub(a, ssd(a));
  }
}
