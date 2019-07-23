import { Ugen } from '../gen';

export function ssd(
  a: Ugen,
  initial: number = 0
): Ugen {
  return gen => {
    const [_a] = gen.prepare(a);
    let [_stored] = gen.declare(initial);
    gen.every(1, `${_stored} = ${_a}`);
    return _stored;
  }
}
