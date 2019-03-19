import { Ugen } from './ugen';

export function gate(
  control: Ugen | number,
  input: Ugen | number,
  { count = 2 }: { count?: number }
): Ugen {
  return gen => {
    const [_control, _input] = gen.prepare(control, input);
    const _outputs = gen.declare((new Array(count)).fill(0).map(e => 0));

    gen.every(1, `${_outputs}[${_control}] = ${_input}`);

    return _outputs;
  }
}
