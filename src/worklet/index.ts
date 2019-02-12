
function genWorklet({ name, parameters, onInit, onMessage, onProcess }) {
  const parameterDefinition = JSON.stringify(parameters.map(({ name, defaultValue }) => ({ name, defaultValue })));
  const code = `
    registerProcessor('${name}',
      class extends AudioWorkletProcessor {
        static get parameterDescriptors() {
          return ${parameterDefinition};
        }

        constructor(options) {
          super(options);
          ${onInit ? onInit({ options: 'options' }) : ''}
          ${onMessage ? `this.port.onmessage = (event) => { ${onMessage({ event: 'event' })} };` : ''}
        }

        process(inputs, outputs, parameters) {
          ${onProcess ? onProcess({ inputs: 'inputs', outputs: 'outputs', parameters: 'parameters' }) : 'return true;'}
        }
      }
    );
  `;

  return new Blob([code], { type: 'application/javascript' });
}

export default function (props) {
  const name = `worklet_${Math.random().toString(36).substring(7)}`;
  const workletUrl = URL.createObjectURL(genWorklet({ ...props, name }));

  return class extends AudioWorkletNode {
    static get workletUrl() { return workletUrl; }

    constructor(context) {
      super(context, name);
    }
  };
}

