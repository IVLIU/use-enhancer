import {
  ReducerWithoutAction,
  ReducerStateWithoutAction,
  DispatchWithoutAction,
  Reducer,
  ReducerState,
  Dispatch,
  useRef,
} from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';
import { compose, isPlainObject } from './utils';
import { TMiddlewareWithoutAction, TMiddleware } from './type';

function useEnhancer<R extends ReducerWithoutAction<any>>(
  store: ReducerStateWithoutAction<R>,
  dispatch: DispatchWithoutAction,
  ...middlewares: TMiddlewareWithoutAction[]
): DispatchWithoutAction;
function useEnhancer<R extends Reducer<any, any>>(
  store: ReducerState<R>,
  dispatch: Dispatch<ReducerState<R>>,
  ...middlewares: TMiddleware[]
): Dispatch<ReducerState<R>>;
function useEnhancer(store: any, dispatch: any, ...middlewares: any[]): any {
  const callbackRef = useRef<typeof dispatch>();
  const storeRef = useRef<typeof store>();
  if (middlewares.length === 0) {
    return callbackRef.current || (callbackRef.current = dispatch);
  }
  storeRef.current = store;
  return (
    callbackRef.current ||
    (callbackRef.current = compose(
      middlewares.map(_m => {
        if (_m.__REDUX__) {
          const middlewareApi = {
            getState: () => storeRef.current,
            dispatch,
          };
          return next => async action => {
            action = await _m(middlewareApi)(() => null)(action);
            if (action) {
              await next(action);
              return;
            }
            await next();
          };
        }
        return _m(storeRef, callbackRef);
      }),
      {
        onCapture: () => null,
        onTarget: effects => {
          batch(() => {
            while (effects) {
              const { action, next } = effects;
              if (isPlainObject(action)) {
                dispatch(action);
              }
              effects = next;
            }
          });
        },
        onBubble: () => null,
      }
    )!.callback)
  );
}

export default useEnhancer;

export * from './middlewares';

export * from './type';
