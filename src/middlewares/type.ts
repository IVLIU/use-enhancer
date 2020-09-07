import {
  ReducerState,
  Dispatch,
  Reducer,
  ReducerStateWithoutAction,
  DispatchWithoutAction,
  ReducerWithoutAction,
  ReducerAction,
  MutableRefObject,
} from 'react';
import { TNext } from '../utils';

export type TMiddlewareWithoutAction = <R extends ReducerWithoutAction<any>>(
  storeRef: MutableRefObject<ReducerStateWithoutAction<R>>,
  dispatchRef: MutableRefObject<DispatchWithoutAction>
) => (next: TNext) => () => Promise<void>;

export type TMiddleware = <R extends Reducer<any, any>>(
  storeRef: MutableRefObject<ReducerState<R>>,
  dispatchRef: MutableRefObject<Dispatch<ReducerAction<R>>>
) => (
  next: TNext
) => (action: ReducerAction<R> | ReducerAction<R>[]) => Promise<void>;
