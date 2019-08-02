import modules from '../modules';
import createGen from '../gen';

export default function (genlet) {
  const name = `worklet_${Math.random().toString(36).substring(7)}`;
  const gen = createGen();

  genlet(Object.assign({
    sys: {
      samplerate: gen.root.samplerate
    }
  },
    ...Object.keys(modules).map(key => ({
      [key]: (...args) => {
        return modules[key](...args)(gen.root);
      }
    })))
  );

  gen.beforeRender.push(...gen.labels.map(label => {
    return `let ${label.name} = ${label.value}`;
  }));

  const parameterDefinition = JSON.stringify(
    gen.parameters.map(({ name, defaultValue }) => ({ name, defaultValue }))
  );

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
          this.memory = new Float32Array(${gen.memorySize});

          ${gen.onInit.join(';')};
          ${gen.onMessage.length > 0 ? `this.port.onmessage = (event) => { ${gen.onMessage.join(';')}; };` : ''}

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

              ${gen.beforeRender.join(';\n')};
              ${gen.onRender.join(';')};
              ${gen.afterRender.join(';')};

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


  console.log(
    {
      afterRender: gen.afterRender
    },
    gen.afterRender.join(';')
  );


  const workletUrl = URL.createObjectURL(
    new Blob([code], { type: 'application/javascript' })
  );

  return class extends AudioWorkletNode {
    static get workletUrl() { return workletUrl; }

    constructor(context) {
      super(context, name);
    }

    trigger(name: string) {
      this.port.postMessage({ type: 'trigger', name });
    }
  };
}
