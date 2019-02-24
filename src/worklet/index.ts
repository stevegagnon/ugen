import codegen from './codegen';

export default function (genlet) {
  const name = `worklet_${Math.random().toString(36).substring(7)}`;
  const code = codegen(name, genlet);
  const workletUrl = URL.createObjectURL(code);

  return class extends AudioWorkletNode {
    static get workletUrl() { return workletUrl; }

    constructor(context) {
      super(context, name);
    }
  };
}
