import { Trigger } from './trigger';

export type Ugen = (gen: Gen) => any;

export function isUgen(o) {
  return typeof o === 'function';
}

export interface Gen {
  samplerate: number,
  frame: Ugen,
  buffer: Ugen;
  input: Ugen,
  output: Ugen | string,
  param(name: string, intial);
  prepare(...args);
  declare(...args);
  alloc(size: number);
  every(frames, ...args);
  schedule(ahead, code);
  on(triggerName, code);
  trigger(name);
  join(seperator, ...parts);
  code: { (strings, ...exprs): unknown, memoize: (strings, ...exprs) => unknown };
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
  let resolved: Map<any, any> = new Map();

  function createLabel(ugen: Ugen) {
    for (const label of labels) {
      if (label.ugen === ugen) {
        return label.name;
      }
    }
    const name = `lbl_${labelIdx++}`;
    const label = { ugen, name, value: ugen(root) };
    labels.push(label);
    return label.name;
  }

  function alloc(size) {
    const offset = memorySize;
    memorySize += size;
    return offset;
  }

  function resolve(v) {
    let _v;

    if (resolved.has(v)) {
      _v = resolved.get(v);
    } else {
      switch (typeof v) {
        case 'function':
          _v = resolve(v(root));
          break;
        default:
          _v = v;
          break;
      }
    }

    //console.log(v, _v);

    return _v;
  }

  function code(strings: string[], ...exprs: any[]) {
    return () => {
      return strings.reduce((a, c, i) => {
        const expr = exprs[i] || '';
        return `${a}${c}${resolve(expr)}`;
      }, '');
    }
  }

  code.memoize = function (strings: string[], ...exprs: any[]) {
    return gen => {
      return strings.reduce((a, c, i) => {
        const expr = exprs[i] || '';
        return `${a}${c}${typeof expr === 'function' ? expr(gen) : expr}`;
      }, '');
    }
  };


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
      const exp = typeof arg === 'function' ? arg(root) : arg;
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
    const trigger = new Trigger(name, root);
    triggers[name] = trigger;
    return trigger;
  }

  function join(seperator, ...parts) {
    return parts.map(part => resolve(part)).join(seperator);
  }

  const root = {
    samplerate: 44100,
    frame: undefined,
    buffer: undefined,
    input: undefined,
    output: 'left[i] = right[i]',
    param,
    prepare,
    declare,
    every,
    schedule,
    on,
    trigger,
    code,
    alloc,
    join
  };

  return {
    root,
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
