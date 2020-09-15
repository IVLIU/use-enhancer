import { queneMacroTask } from './queneMacroTask';
import { queneMicroTask } from './queneMicroTask';
import { TEffect } from './type';

export const schedule: (
  effects: TEffect,
  executor: (effect: TEffect) => void
) => void = (effects, executor) => {
  executor(effects);
  queneMicroTask(() => console.log('micro', effects));
  queneMacroTask(() => console.log('macro', effects));
};
