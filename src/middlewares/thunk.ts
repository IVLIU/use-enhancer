import { TMiddleware } from './type';

export const thunk: TMiddleware = () => next => async action => {
  try {
    if(!action || typeof action !== 'function') {
      await next();
      return;
    }
    action = await action();
    await next(action);
  } catch(err) {
    console.error('The error occurred in thunk middleware:', err)
  }
}