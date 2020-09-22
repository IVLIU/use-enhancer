import { unstable_batchedUpdates as batch } from 'react-dom';
import { check } from './check';
// import { queneMacroTask } from './queneMacroTask';
// import { queneMicroTask } from './queneMicroTask';
import { TBaseAction, TDispatch, TUpdate } from './type';

type TSchedule = (
  dispatch: TDispatch,
  enhancer: any
) => (updates: TUpdate) => void;

export const schedule: TSchedule = (dispatch, enhancer) => updates => {
  console.log(enhancer);
  batch(() => {
    while (updates) {
      const { tag, action, next } = updates;
      if (tag === 1) {
        check(action);
        dispatch(action as TBaseAction);
      }
      updates = next;
    }
  });
};
