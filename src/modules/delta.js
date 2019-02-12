
import { ssd } from './ssd';
import { sub } from './arithmetic';

export function delta(a) {
  return gen => {
    const n = ssd();
    n.in(a);
    return sub(a, n.out);
  }
}
