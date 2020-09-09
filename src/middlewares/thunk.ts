import { TMiddleware } from './type';

export const thunk: TMiddleware = storeRef => next => async action => {
  try {
    if (!action || typeof action !== 'function') {
      await next();
      return;
    }
    action = await action(storeRef.current);
    await next(action);
  } catch (err) {
    console.error('The error occurred in thunk middleware:', err);
  }
};
