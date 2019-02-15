import { Trigger } from './trigger';
import modules from '../modules';

enum CodeSection {
  INIT,
  BEFORE_RENDER,
  RENDER,
  AFTER_RENDER
};

export class Gen {
  samplerate: number = 44100;
  triggers: { [key: string]: Trigger };
  labels: { fn: (gen: Gen) => any, name: string }[] = [];
  labelIdx: number = 1;
  code = {
    [CodeSection.INIT]: '',
    [CodeSection.BEFORE_RENDER]: '',
    [CodeSection.RENDER]: '',
    [CodeSection.AFTER_RENDER]: ''
  };

  constructor(fn) {
    this.code[CodeSection.INIT] = `
      let frame = 0;
      let scheduled = [];
      let schedule = (ahead, fn) => {
        const i = frame + ahead;
        if (scheduled[i]) {
          scheduled[i].push(fn);
        } else {
          scheduled[i] = [fn];
        }
      }
    `;

    this.code[CodeSection.AFTER_RENDER] = `
      if (scheduled[frame]) {
        const tasks = scheduled.splice(frame, 1);
        tasks.forEach(task => task());
      }
      ++frame;
    `;

    const worker = fn(Object.assign({},
      ...Object.keys(modules).map(key => ({
        [key]: (...args) => modules[key](...args)(this)
      })))
    );

    console.log(worker, this);
    console.log(this.labels.map(l => `let ${l.name} = ${l.fn(this)}`));
  }

  emit(code: string, section: CodeSection = CodeSection.RENDER) {
    this.code[section] += `${code};`;
  }

  createLabel(fn: (gen: Gen) => any) {
    for (const label of this.labels) {
      if (label.fn === fn) {
        return label.name;
      }
    }
    const label = { fn, name: `lbl_${this.labelIdx++}` };
    this.labels.push(label);
    return label.name;
  }

  param(name: string, intial = 0) {
    const label = {
      fn: () => intial,
      name: `param_${this.labelIdx++}`
    }
    this.labels.push(label);
    return label.name;
  }

  prepare(...args) {
    return args.map(arg => {
      if (typeof arg === 'function') {
        return this.createLabel(arg);
      } else {
        return arg;
      }
    });
  }

  lets(...args) {
    return args.map(arg => {
      const label = `lets_${this.labelIdx++}`;
      this.emit(`let ${label} = ${arg}`);
      return label;
    });
  }

  every(frames, ...args) {
    return args.map(arg => {
      if (frames === 1) {
        this.emit(arg, CodeSection.AFTER_RENDER);
      } else {
        this.emit(`
          if (frame % ${frames} === 0) {
            ${arg}
          }
        `);
      }
    });
  }

  schedule(ahead, code) {
    return `schedule(${ahead}, () => { ${code} })`;
  }

  createTrigger(name) {
    const trigger = new Trigger(this);
    this.triggers[name] = trigger;
    return trigger;
  }
}
