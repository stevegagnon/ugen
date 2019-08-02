
import genlet from './worklet';





genlet(
  ({ sys, trigger, play, mul, add, decay, cycle }) => {
    var baseFrequency = 80,
      c2m = 1.4,
      index = .95

    // create our oscillator for modulation
    var modulator = cycle(mul(baseFrequency, c2m))

    // scale amplitude based on index value, re-assign
    modulator = mul(modulator, mul(baseFrequency, index))

    // create carrier oscillator and modulate frequency
    var carrier = cycle(add(baseFrequency, modulator))

    const t = trigger('test');

    // create an exponential decay lasting eight seconds
    var env = decay(t, sys.samplerate * 8)

    // multiply carrier output by envelope and play
    play(mul(carrier, env))
  }
);

/*
genlet(
  ({ play, mul }) => {
    play(mul(1, 2));
  }
);
*/