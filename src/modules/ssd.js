
export function ssd(a, initial = 0) {
  return gen => {
    const [_a] = gen.prepare(a);
    let [_stored] = gen.declare(initial);
    gen.every(1, `${_stored} = ${_a}`);
    return _stored;
  }
}
