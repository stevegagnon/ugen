import { Ugen } from './ugen';

export function sah(
  sample: Ugen | number,
  control: Ugen | number,
  threshold: Ugen | number = 0
): Ugen {
  return gen => {
    const [_sample, _control, _threshold] = gen.prepare(sample, control, threshold);
    const [_held, _previous_control] = gen.declare(_sample, _threshold);

    gen.every(1, `
      if (${_control} > ${_threshold} && ${_previous_control} <= ${_threshold}) {
        ${_held} = ${_sample};
      }
      ${_previous_control} = ${_control};
    `);

    return _held;
  }
}
