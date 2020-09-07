import { TMiddleware } from './type';

export const all: TMiddleware = () => next => async actions => {
  try {
    if (!actions || !Array.isArray(actions)) {
      await next();
      return;
    }
    actions = await Promise.all(
      actions.reduce<Promise<typeof actions[0]>[]>((prev, current) => {
        if (typeof current === 'function') {
          return [...prev, current()];
        }
        return [...prev, Promise.resolve(current)];
      }, [])
    );
    await next(...actions);
  } catch (err) {
    console.error('The error occurred in all middleware:', err);
  }
};
