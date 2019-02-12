
export function selector(control, ...inputs) {
  return gen => {
    const [_control] = gen.prepare(control);
    const [_inputs] = gen.prepare(inputs);
    return `(${_inputs}[${_control}])`;
  }
}
