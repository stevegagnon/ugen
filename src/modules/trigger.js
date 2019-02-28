
export function trigger(name) {
  return gen => {
    return gen.trigger(name);
  }
}
