import { ssd } from './ssd';
import { sub, add, div } from './arithmetic';
import { memo } from './memo';
import { gt } from './comparison';
import { selector } from './selector';

export function slide(sample, slideUp = 1, slideDown = 1) {
  return gen => {
    let y1 = ssd();

    //y (n) = y (n-1) + ((x (n) - y (n-1))/slide) 
    const slideAmount = selector(gt(sample, y1.out), slideUp, slideDown)

    const filter = memo(add(y1.out, div(sub(sample, y1.out), slideAmount)))

    y1.in(filter)

    return filter
  }
}
