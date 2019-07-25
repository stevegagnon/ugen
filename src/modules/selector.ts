import { Ugen } from '../gen';

export function selector(
  control: number | Ugen,
  ...inputs: (number | Ugen)[]
): Ugen {
  return ({ code, join }) => {
    return code`[${join(',', ...inputs)}][${control}]`;
  }
}
