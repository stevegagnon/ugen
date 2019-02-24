
import genlet from './worklet';

const OurProcessorNode = genlet(
  ({ param, mul, add, phasor, trigger, decay, ssd, input }) => {
    return mul(decay(trigger('note')), ssd(input()));
  }
);
