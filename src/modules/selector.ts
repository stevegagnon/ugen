import { Ugen } from './ugen';

export function selector(
  control: Ugen | number,
  ...inputs: Array<Ugen | number>
): Ugen {
  return gen => {
    const [_control] = gen.prepare(control);
    const [_inputs] = gen.prepare(inputs);
    return `(${_inputs}[${_control}])`;
  }
}
