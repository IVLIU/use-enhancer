import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useEnhancer from '../.';

const thunk = () => next => async action => {
  if(!action || typeof action !== 'function') {
    await next();
    return;
  }
  action = await action();
  await next(action);
};

const all = () => next => async actions => {
  if(!actions || !Array.isArray(actions)) {
    await next();
    return;
  }
  actions = await Promise.all(
    actions.reduce((prev, current) => {
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
    }, [] as Promise<typeof actions[0]>[]),
  )
  await next(...actions);
}

const reducer = (state, action) => {
  const { type, payload } = action;
  switch(type) {
    case 'ASYNC_ACTION':
      return {
        ...state,
        ...payload,
      }
    case 'NORMAL_ACTION':
      return {
        ...state,
        ...payload,
      }
    case 'ALL1_ACTION':
      return {
        ...state,
        ...payload,
      }
      case 'ALL2_ACTION':
        return {
          ...state,
          ...payload,
        }
      case 'ADD_ACTION':
        return {
          ...state,
          ...payload,
        }
      case 'EXTRA_ACTION':
        return {
          ...state,
          ...payload,
        };
    default: 
      return state;
  }
};

const App = () => {
  const [state, rawDispatch] = React.useReducer(reducer, { value: 'initial', count: 0, extra: 0 });
  const dispatch = useEnhancer(
    state, 
    rawDispatch, 
    () => next => async () => await next(),
    () => next => async () => await next(),
    (storeRef, dispatchRef) => next => async () => {
      await next();
      if(storeRef.current.extra !== 0) {
        return;
      }
      // 我不知道为啥，但是需要as any下，否则会报类型不匹配的错误
      dispatchRef.current({
        type: 'EXTRA_ACTION',
        payload: { extra: 1 }
      } as any);
    },
    thunk,
    storeRef => next => async () => {
      console.log('dispatch brefore', storeRef.current);
      await next();
      console.log('dispatch after', storeRef.current);
    },
    all,
  );
  React.useEffect(() => {
    dispatch(async () => {
      await new Promise(r => setTimeout(() => {
        r();
      }, 1000));
      return ({ type: 'ASYNC_ACTION', payload: { value: 'async' } });
    })
  }, [])
  return (
    <div>
      <h2>{state.count}</h2>
      <h2>{state.value}</h2>
      <div onClick={() => dispatch({
        type: 'NORMAL_ACTION',
        payload: {
          value: 'normal'
        }
      })}>NORMAL</div>
      <div onClick={() => dispatch([
        {
          type: 'ALL1_ACTION',
        payload: {
          value: 'all1'
        }
        },
        {
          type: 'ALL2_ACTION',
          payload: {
            value: 'all2'
          }
        }
      ])}>ALL</div>
      <div onClick={() => dispatch({
        type: 'ADD_ACTION',
        payload: {
          count: state.count + 1,
        }
      })}>ADD</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
