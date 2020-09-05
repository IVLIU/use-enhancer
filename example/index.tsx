import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useEnhancer from '../.';

const thunk = () => next => async action => {
  if(!action) {
    await next();
    return;
  }
  if(typeof action === 'function') {
    action = await action();
  }
  await next(action);
};

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
    default: 
      return state;
  }
};

const App = () => {
  const [state, rawDispatch] = React.useReducer(reducer, { value: 'initial' });
  const dispatch = useEnhancer(
    state, 
    rawDispatch, 
    () => next => async () => await next(),
    () => next => async () => await next(),
    () => next => async () => await next(),
    thunk,
    () => next => async () => {
      console.log('m start.');
      await next();
      console.log('m end.');
    },
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
      {state.value}
      <div onClick={() => dispatch({
        type: 'NORMAL_ACTION',
        payload: {
          value: 'normal'
        }
      })}>NORMAL</div>
      {/* <div onClick={() => dispatch([
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
      ])}>ALL</div> */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
