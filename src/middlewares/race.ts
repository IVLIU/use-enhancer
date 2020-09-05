import { TMiddleware } from './type';

export const race: TMiddleware = () => next => async actions => {
  try {
    if(!actions || !Array.isArray(actions)) {
      await next();
      return;
    }
    const action = await Promise.race(
      actions.reduce<Promise<typeof actions[0]>[]>((prev, current) => {
        if(typeof current === 'function') {
          return [
            ...prev,
            current(),
          ]
        }
        return [
          ...prev,
          Promise.resolve(current),
        ]
      }, []),
    )
    await next(action);
  } catch(err) {
    console.error('The error occurred in race middleware:', err);
  }
}