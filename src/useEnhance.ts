import { useRef, useMemo } from 'react';
import compose from './compose';
import type {
  Reducer,
  ReducerWithoutAction,
  ReducerState,
  ReducerStateWithoutAction,
  Dispatch,
  DispatchWithoutAction,
  ReducerAction,
} from 'react';
import type {
  Action,
  AnyAction,
  Middleware,
  MiddlewareAPI,
  Dispatch as EnhanceDispatch,
} from './type';

export function useEnhance<
  S extends ReducerStateWithoutAction<ReducerWithoutAction<any>>,
  D extends DispatchWithoutAction,
  A extends Action = AnyAction,
>(
  rawState: S,
  rawDispatch: D,
  ...middlewareList: Middleware[]
): [S, EnhanceDispatch];
export function useEnhance<
  S extends ReducerState<Reducer<any, any>>,
  D extends Dispatch<ReducerAction<Reducer<any, any>>>,
>(
  rawState: S,
  rawDispatch: D,
  ...middlewareList: Middleware[]
): [S, EnhanceDispatch<Parameters<D>[0]>];
export function useEnhance<
  S extends
    | ReducerStateWithoutAction<ReducerWithoutAction<any>>
    | ReducerState<Reducer<any, any>>,
  D extends DispatchWithoutAction | Dispatch<ReducerAction<Reducer<any, any>>>,
>(
  rawState: S,
  rawDispatch: D,
  ...middlewareList: Middleware[]
): [S, EnhanceDispatch<Parameters<D>[0]>] {
  const rawStateRef = useRef(rawState);

  let dispatch: EnhanceDispatch<Parameters<D>[0]> = () => {
    throw new Error(
      'Dispatching while constructing your middleware is not allowed. ' +
        'Other middleware would not be applied to this dispatch.',
    );
  };

  rawStateRef.current = rawState;

  dispatch = useMemo(() => {
    const middlewareAPI = {
      dispatch: (action: ReducerAction<Reducer<S, Parameters<D>[0]>>) =>
        dispatch(action),
      getState: () => rawStateRef.current,
    } as MiddlewareAPI;
    const chain = middlewareList.map((middleware) => middleware(middlewareAPI));
    return compose<typeof dispatch>(...chain)(rawDispatch);
  }, middlewareList);
  return [rawState, dispatch];
}