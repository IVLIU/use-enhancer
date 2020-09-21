import { unstable_batchedUpdates as batch } from 'react-dom';
import { check } from './check';
// import { queneMacroTask } from './queneMacroTask';
// import { queneMicroTask } from './queneMicroTask';
import { TBaseAction, TDispatch, TEffect } from './type';

export const schedule: (
  dispatch: TDispatch
) => (effects: TEffect) => void = dispatch => effects => {
  batch(() => {
    while (effects) {
      const { tag, action, next } = effects;
      if (tag === 1) {
        check(action);
        dispatch(action as TBaseAction);
      }
      effects = next;
    }
  });
};
