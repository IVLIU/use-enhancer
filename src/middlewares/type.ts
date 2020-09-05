import { 
  ReducerState, 
  Dispatch, 
  Reducer,
  ReducerStateWithoutAction, 
  DispatchWithoutAction, 
  ReducerWithoutAction,
  ReducerAction 
} from 'react';
import { TNext } from '../utils';

export type TMiddlewareWithoutAction = <R extends ReducerWithoutAction<any>>(
  store: ReducerStateWithoutAction<R>, 
  dispatch: DispatchWithoutAction
) => (next: TNext) => () => Promise<void>;

export type TMiddleware = <R extends Reducer<any, any>>(
  store: ReducerState<R>, 
  Dispatch: Dispatch<ReducerState<R>>
) => (next: TNext) => (action: ReducerAction<R> | ReducerAction<R>[]) => Promise<void>;