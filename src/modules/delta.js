
import { ssd } from './ssd';
import { sub } from './arithmetic';

export function delta(a) {
  return gen => {
    return sub(a, ssd(a));
  }
}
