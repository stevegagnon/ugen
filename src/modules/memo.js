
export function memo(a) {
  return gen => {
    const [_a] = gen.prepare(a);
    const [_store] = gen.lets(_a);
    return _store;
  }
}
