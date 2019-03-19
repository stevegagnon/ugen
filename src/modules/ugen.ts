
export type Ugen = (gen: Gen) => any;

export interface Gen {
  samplerate: number,
  _frame: string,
  _buffer: string;
  param(name: string, intial);
  prepare(...args);
  declare(...args);
  alloc(size: number);
  every(frames, ...args);
  schedule(ahead, code);
  on(triggerName, code);
  trigger(name);
  code(strings, ...exps);
}


