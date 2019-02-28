
export function bang(trigger, { min = 0, max = 1 }) {
  return gen => {
    const [_current] = gen.declare(min);
    trigger.on(`${_current} = ${max}`).delay(1, `${_current} = ${min}`);
    return _current;
  }
}
