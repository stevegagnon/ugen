import { Ugen } from '../gen';
import { sub, add, mul } from './arithmetic';

export function dcblock(a: number | Ugen): Ugen {
  return ({ declare, every, code }) => {
    const [x1, y1] = declare(0, 0);

    //History x1, y1; y = in1 - x1 + y1*0.9997; x1 = in1; y1 = y; out1 = y;
    const filter = add(sub(a, x1), mul(y1, .9997));

    every(1, code`
      ${x1} = ${a};
      ${y1} = ${filter};
    `);

    return filter;
  }
}
