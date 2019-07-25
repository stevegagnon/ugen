import { Ugen } from '../gen';

export function delay(a: Ugen, size: number) {
  let offset;
  return {
    tap: (delay: number): Ugen => {
      return ({ buffer, frame, alloc, every, code }) => {
        if (delay > 0) {
          if (!offset || !a) {
            offset = alloc(size);
            every(1, code`${buffer}[${offset} + ${frame} % ${size}] = ${a}`);
          }
          return code`${buffer}[${offset} + (${frame} - ${delay + 1}) % ${size}]`;
        } else {
          return a;
        }
      }
    }
  }
}
