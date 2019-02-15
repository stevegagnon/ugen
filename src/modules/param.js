
export function param(name, initial) {
  return gen => {
    const _param = gen.param(name, initial);
    return _param;
  }
}
