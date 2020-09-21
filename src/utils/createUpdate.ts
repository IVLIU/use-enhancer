import { isPromise } from './isPromise';
import { isAsyncFunction } from './isAsyncFunction';
import { TTag, TUpdate } from './type';

export const createUpdate: (action: any) => TUpdate = action => {
  let tag: TTag = 1;
  if (isPromise(action)) {
    tag = 2;
  }
  if (isAsyncFunction(action)) {
    tag = 3;
  }
  return {
    tag,
    action,
    next: null,
  };
};
