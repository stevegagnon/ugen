import { Trigger } from './trigger';

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

export default function () {
  let onRender = [];
  let beforeRender = [];
  let onInit = [];
  let onMessage = [];
  let afterRender = [];
  let memorySize = 0;
  let parameters = [];
  let triggers: { [key: string]: Trigger } = {};
  let labels: { ugen: Ugen, name: string, value: string }[] = [];
  let labelIdx: number = 1;

  function createLabel(ugen: Ugen) {
    for (const label of labels) {
      if (label.ugen === ugen) {
        return label.name;
      }
    }
    const name = `lbl_${labelIdx++}`;
    const label = { ugen, name, value: ugen(createUgen(name)) };
    labels.push(label);
    return label.name;
  }

  function alloc(size) {
    const offset = memorySize;
    memorySize += size;
    return offset;
  }

  function createUgen(name?): Gen {
    function code(strings: string[], ...exps: any[]) {
      return gen => {
        return strings.reduce((a, c, i) => {
          const e = exps[i] || '';
          return `${a}${c}${typeof e === 'function' ? e(gen) : e}`;
        }, '');
      }
    }

    function param(name: string, defaultValue = 0) {
      const label = {
        ugen: () => defaultValue,
        name: `param_${labelIdx++}`,
        value: `parameters['${name}'].length === 1 ? parameters['${name}'][0] : parameters['${name}'][i]`
      }
      labels.push(label);
      parameters.push({ name, defaultValue });
      return label.name;
    }

    function prepare(...args) {
      return args.map(arg => {
        if (typeof arg === 'function') {
          return createLabel(arg);
        } else {
          return arg;
        }
      });
    }

    function declare(...args) {
      return args.map(arg => {
        const label = `memory[${alloc(1)}]`;
        onInit.push(`${label} = ${arg}`);
        return label;
      });
    }

    function every(frames, ...args) {
      return args.map(arg => {
        const exp = typeof arg === 'function' ? arg(createUgen()) : arg;
        afterRender.push(frames === 1 ? exp : `if (this.frame % ${frames} === 0) { ${exp} }`);
      });
    }

    function schedule(ahead: number, code: string) {
      return `this.schedule(${ahead}, () => { ${code} })`;
    }

    function on(triggerName: string, code) {
      onMessage.push(`
          if (event.type === 'trigger' && event.name === '${triggerName}') {
            ${code}
          }
        `);
    }

    function trigger(name: string) {
      const trigger = new Trigger(name, createUgen('trigger'));
      triggers[name] = trigger;
      return trigger;
    }

    return {
      samplerate: 44100,
      _frame: '_frame',
      _buffer: '_buffer',
      param,
      prepare,
      declare,
      every,
      schedule,
      on,
      trigger,
      code,
      alloc
    };
  }

  return {
    createUgen,
    onRender,
    beforeRender,
    onInit,
    onMessage,
    afterRender,
    memorySize,
    parameters,
    triggers,
    labels,
  };
}
