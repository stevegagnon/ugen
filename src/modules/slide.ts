import { Ugen } from '../gen';
import { sub, add, div } from './arithmetic';
import { gt } from './comparison';
import { selector } from './selector';

export function slide(
  sample: number | Ugen,
  slideUp: number | Ugen = 1,
  slideDown: number | Ugen = 1
): Ugen {
  return ({ declare, every }) => {
    const [y1] = declare(0);

    //y (n) = y (n-1) + ((x (n) - y (n-1))/slide) 
    const slideAmount = selector(gt(sample, y1), slideUp, slideDown)

    const filter = add(y1, div(sub(sample, y1), slideAmount));

    every(1, `${y1} = ${filter}`);

    return filter
  }
}
