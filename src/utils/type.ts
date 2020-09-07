import { Reducer, ReducerAction } from 'react';

export type TNext = <R extends Reducer<any, any>>(
  ...actions: ReducerAction<R>[]
) => Promise<void>;
