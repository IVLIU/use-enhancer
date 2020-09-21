import { schedule } from './schedule';
import { createUpdate } from './createUpdate';
import { TAction, TDispatch, TUpdate } from './type';

type TCreateQueneUpdater = (
  dispatch: TDispatch,
  enhancer: any
) => (action: TAction) => void;

let updateQuene: TUpdate = null;
let currentUpdate: TUpdate = null;

export const createQueneUpdater: TCreateQueneUpdater = dispatch => action => {
  if (!updateQuene) {
    updateQuene = currentUpdate = createUpdate(action);
  } else {
    currentUpdate = currentUpdate!.next = createUpdate(action);
  }
  schedule(dispatch)(updateQuene);
};
