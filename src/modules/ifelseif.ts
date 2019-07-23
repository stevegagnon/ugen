import { Ugen } from '../ugen';

export function ifelseif(...args: (number | Ugen)[]): Ugen {
  return gen => {
    const _args = gen.prepare(...args);
    const _ifs = [];
    let i = 0;

    while (i < _args.length - 1) {
      _ifs.push(`${_args[i]} ? ${_args[i + 1]}`);
      i += 2;
    }

    return `(${_ifs.join(' : ')} : ${_args[i]})`
  }
}
