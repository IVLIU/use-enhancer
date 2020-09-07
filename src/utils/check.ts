import { isPlainObject } from './isPlainObject';

type TCheck = (action: any) => never | void;

export const check: TCheck = action => {
  if (!isPlainObject(action)) {
    throw new Error(
      'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
    );
  }
  if (!action.type) {
    throw new Error(
      'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
    );
  }
};
