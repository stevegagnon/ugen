
import { Trigger } from './trigger';
import modules from '../modules';

type Ugen = (ugen) => any;

export interface Gen {
  samplerate: number,
  param(name: string, intial);
  prepare(...args);
  lets(...args);
  every(frames, ...args);
  schedule(ahead, code);
  on(triggerName, code);
  createTrigger(name);
  exp(strings, ...exps);
}

export default function (name, genlet) {
  let memorySize = 0;
  let onInit = [];
  let onMessage = [];
  let onRender = [];
  let beforeRender = [];
  let afterRender = [];
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
    const label = { ugen, name, value: ugen(createGen(name)) };
    labels.push(label);
    return label.name;
  }

  function alloc(size) {
    const offset = memorySize;
    memorySize += size;
    return offset;
  }

  function createGen(name): Gen {
    const gen = {
      samplerate: 44100,

      param(name: string, defaultValue = 0) {
        const label = {
          ugen: () => defaultValue,
          name: `param_${labelIdx++}`,
          value: `parameters['${name}'].length === 1 ? parameters['${name}'][0] : parameters['${name}'][i]`
        }
        labels.push(label);
        parameters.push({ name, defaultValue });
        return label.name;
      },

      prepare(...args) {
        return args.map(arg => {
          if (typeof arg === 'function') {
            return createLabel(arg);
          } else {
            return arg;
          }
        });
      },

      lets(...args) {
        return args.map(arg => {
          const label = `memory[${alloc(1)}]`;
          onInit.push(`${label} = ${arg}`);
          return label;
        });
      },

      every(frames, ...args) {
        return args.map(arg => {
          const exp = typeof arg === 'function' ? arg(gen) : arg;
          afterRender.push(frames === 1 ? exp : `if (this.frame % ${frames} === 0) { ${exp} }`);
        });
      },

      schedule(ahead, code) {
        return `this.schedule(${ahead}, () => { ${code} })`;
      },

      on(triggerName, code) {
        onMessage.push(`
          if (event.name === '${triggerName}') {
              ${code}
          }
        `);
      },

      createTrigger(name) {
        const trigger = new Trigger(name, createGen('trigger'));
        triggers[name] = trigger;
        return trigger;
      },

      exp(strings, ...exps) {
        return gen => {
          return strings.reduce((a, c, i) => {
            const e = exps[i] || '';
            return `${a}${c}${typeof e === 'function' ? e(gen) : e}`;
          }, '');
        }
      }
    };

    return gen;
  }

  const worker = genlet(Object.assign({},
    ...Object.keys(modules).map(key => ({
      [key]: (...args) => {
        return modules[key](...args)(createGen(key));
      }
    })))
  );

  const gen = createGen('root');

  onRender.push(`right[i] = left[i] = ${gen.prepare(worker)};\n`);


  beforeRender.push(...labels.map(label => {
    return `let ${label.name} = ${label.value}`;
  }));


  const parameterDefinition = JSON.stringify(parameters.map(({ name, defaultValue }) => ({ name, defaultValue })));

  const code = `
    registerProcessor('${name}',
      class extends AudioWorkletProcessor {
        static get parameterDescriptors() {
          return ${parameterDefinition};
        }

        constructor(options) {
          super(options);
          this.frame = 0;
          this.scheduled = [];
          this.memory = new Float32Array(${memorySize});

          ${onInit.join(';')};
          ${onMessage.length > 0 ? `this.port.onmessage = (event) => { ${onMessage.join(';')}; };` : ''}

          this.initialized = true;
        }

        process(inputs, outputs, parameters) {
          if( this.initialized === true ) {
            const output = outputs[0];
            const left = output[0];
            const right = output[1];
            const len = left.length;
            const memory = this.memory;

            for(let i = 0; i < len; ++i) {
              const input = inputs[0][i];

              ${beforeRender.join(';\n')};
              ${onRender.join(';')};
              ${afterRender.join(';')};

              if (this.scheduled[this.frame]) {
                const tasks = this.scheduled.splice(this.frame, 1);
                tasks.forEach(task => task());
              }
              ++this.frame;
            }
          }
          return true;
        }

        schedule(ahead, ugen) {
          const i = frame + ahead;
          if (this.scheduled[i]) {
            this.scheduled[i].push(ugen);
          } else {
            this.scheduled[i] = [ugen];
          }
        }
      }
    );
  `;

  console.log(code);

  return new Blob([code], { type: 'application/javascript' });
}
