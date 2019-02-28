
export function gate(control, input, { count = 2 }) {
  return gen => {
    const [_control, _input] = gen.prepare(control, input);
    const _outputs = gen.declare(Array(count).fill().map(e => 0));

    gen.every(1, `${_outputs}[${_control}] = ${_input}`);

    return _outputs;
  }
}
