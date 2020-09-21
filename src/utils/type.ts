import { Dispatch, DispatchWithoutAction, Reducer, ReducerAction } from 'react';

export type TNext = <R extends Reducer<any, any>>(
  ...actions: ReducerAction<R>[]
) => Promise<void>;

export type TBaseAction<P = any> = { type: string; payload: P };

export type TDispatch = DispatchWithoutAction | Dispatch<TBaseAction>;

export type TAction =
  | TBaseAction
  | Promise<TBaseAction>
  | ((...args: any[]) => Promise<TBaseAction>);

export type TTag = 1 | 2 | 3; /** 1 plainObject 2 promise 3 asyncFunction */

export type TEffect = {
  tag: TTag;
  action: TAction;
  next: TEffect | null;
} | null;

export type TUpdate = TEffect;
