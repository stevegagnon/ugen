import { Ugen } from '../ugen';
import { sub, add, mul } from './arithmetic';

export function dcblock(a: number | Ugen): Ugen {
  return gen => {
    const [_a] = gen.prepare(a);
    const [_x1, _y1] = gen.declare(0, 0);

    //History x1, y1; y = in1 - x1 + y1*0.9997; x1 = in1; y1 = y; out1 = y;
    const filter = add(sub(a, _x1), mul(_y1, .9997));

    gen.every(1, `
      ${_x1} = ${_a};
      ${_y1} = ${filter};
    `);

    return filter;
  }
}
