import { Reducer, ReducerAction } from 'react';

export type TNext = <R extends Reducer<any, any>>(
  ...actions: ReducerAction<R>[]
) => Promise<void>;

export type TTag = 1 | 2 | 3; /** 1 plainObject 2 promise 3 asyncFunction */

export type TAction = {
  type: string;
  payload: any;
} | null;

export type TEffect = {
  tag: TTag;
  action: TAction;
  next: TEffect | null;
} | null;

export type TUpdate = TEffect;
