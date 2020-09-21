import {
  ReducerWithoutAction,
  ReducerStateWithoutAction,
  DispatchWithoutAction,
  Reducer,
  ReducerState,
  Dispatch,
  useRef,
} from 'react';
import { createQueneUpdater, compose } from './utils';
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
  const storeRef = useRef<typeof store>();
  const queneUpdateRef = useRef<ReturnType<typeof createQueneUpdater>>();
  storeRef.current = store;
  return (
    queneUpdateRef.current ||
    (queneUpdateRef.current = createQueneUpdater(
      dispatch,
      compose(
        middlewares.map(_m => {
          return _m(storeRef, dispatch);
        })
      )
    ))
  );
}

export default useEnhancer;

export * from './middlewares';

export * from './type';
