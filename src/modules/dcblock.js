import { ssd } from './ssd';
import { sub, add, mul } from './arithmetic';
import { memo } from './memo';

export function dcblock(a) {
  return gen => {
    const x1 = ssd();
    const y1 = ssd();

    //History x1, y1; y = in1 - x1 + y1*0.9997; x1 = in1; y1 = y; out1 = y;
    const filter = memo(add(sub(in1, x1.out), mul(y1.out, .9997)));
    x1.in(in1);
    y1.in(filter);

    return filter;
  }
}
