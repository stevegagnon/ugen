
export function trigger(name) {
  return gen => {
    return gen.createTrigger(name);
  }
}
