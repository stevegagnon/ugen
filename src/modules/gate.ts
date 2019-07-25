import { Ugen } from '../gen';

export function gate(
  control: number | Ugen,
  input: number | Ugen,
  { count = 2 }: { count?: number }
): Ugen {
  return ({ join, declare, every, code }) => {
    const outputs = declare((new Array(count)).fill(0).map(e => 0));

    every(1, code`[${join(',', outputs)}][${control}] = ${input}`);

    return outputs;
  }
}
