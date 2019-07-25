import { Ugen } from '../gen';

export function bang(
  trigger,
  { min = 0, max = 1 }: { min?: number, max?: number }
): Ugen {
  return ({declare, code}) => {
    const [current] = declare(min);
    trigger.on(code`${current} = ${max}`).delay(1, code`${current} = ${min}`);
    return current;
  }
}
