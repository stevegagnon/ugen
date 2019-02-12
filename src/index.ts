
import genlet from './worklet/genlet';

const OurProcessorNode = genlet({
  samplerate: 44100,
  step: g => {
    const frequency = g.param('mouseY', 330)
    const portamento = g.slide(frequency, 1000)
    const lfo = g.mul(g.cycle(5), g.param('mouseX', 15))
    const vibrato = g.add(portamento, lfo)
    g.play(g.mul(g.cycle(vibrato), .15))
  }
});

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



/*
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
