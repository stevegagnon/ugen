import { Gen } from './codegen';

export class Trigger {
  _param;

  constructor(private name: string, private gen: Gen) {
    this._param = gen.declare(0);
  }

  trigger() {
    return `${this._param} = 1`;
  }

  on(ugen) {
    const code = typeof ugen === 'function' ? ugen(this.gen) : ugen;
    this.gen.on(this.name, `
      ${code || ''}
      ${this.gen.schedule(1, `${this._param} = 0`)}
    `);
    return this;
  }

  delay(frames, ugen) {
    const code = ugen(this.gen);
    this.gen.on(this.name, `
      ${code ? this.gen.schedule(frames, code) : ''};
      ${this.gen.schedule(1, `${this._param} = 0`)};
    `);
    return this;
  }
}
