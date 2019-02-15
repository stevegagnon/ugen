
import genlet from './worklet';

const OurProcessorNode = genlet(
  ({ param, mul, add, phasor }) => {
    const p1 = param('p1');
    const p2 = param('p2');
    return mul(phasor(440), mul(p1, add(p2, 40)));
  }
);


/*
const button = document.createElement('button');
button.innerText = 'run';
button.onclick = () => {
  const context = new AudioContext();

  context.audioWorklet.addModule(OurProcessorNode.workletUrl).then(() => {
    let gainWorkletNode = new OurProcessorNode(context);
    gainWorkletNode.connect(context.destination);
  });
};
document.body.appendChild(button);


import gen from './worklet';

const OurProcessorNode = gen({
  parameters: [
    { name: 'gain', defaultValue: 1.0 },
    { name: 'asdasd', defaultValue: 4.23 },

  ],
  onInit: ({ options }) => `console.log('asdasd', JSON.stringify(${options}));`,
  onProcess: ({ parameters }) => `console.log(JSON.stringify(${parameters}));`
});
*/
