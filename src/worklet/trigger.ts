import { Gen } from './gen';

export class Trigger {
  _param;

  constructor(private gen: Gen) {
    this._param = gen.lets(0);
  }

  trigger() {
    return `${this._param} = 1`;
  }

  on(code) {
    this.gen.every(1, `
      if (${this._param}) {
        ${code}
        ${this.gen.schedule(1, `${this._param} = 0`)}
      }
    `);
    return this;
  }

  delay(frames, code) {
    this.gen.every(1, `
      if (${this._param}) {
        ${this.gen.schedule(frames, code)};
        ${this.gen.schedule(1, `${this._param} = 0`)};
      }
    `);
    return this;
  }
}
