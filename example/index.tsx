import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useEnhancer, { thunk, all } from '../.';
import './index.less';

type TState = {
  count: number;
  txt1: string;
  txt2: string;
  txt3: string;
  iVal: string;
  sVal: string;
}

const reducer: React.Reducer<TState, { type: string, payload: { [key: string]: any } }> = (state, action) => {
  const { type, payload } = action;
  switch(type) {
    case 'ADD_COUNT':
    case 'FETCH_ONE':
    case 'FETCH_TWO':
    case 'FETCH_THERE':
    case 'CHANGE_VALUE':
    case 'GET_STOREGE':
      return {
        ...state,
        ...payload,
      }
    default: 
      return state;
  }
};

const App = () => {
  const [state, rawDispatch] = React.useReducer(
    reducer, 
    { count: 0, txt1: '', txt2: '', txt3: '', iVal: '', sVal: '' },
  );
  const dispatch = useEnhancer(
    state, 
    rawDispatch, 
    // all,
    // () => next => async () => await next(),
    thunk,
  );
  React.useEffect(() => {
    dispatch({ type: 'NORMAL_TYPE', payload: {} });
    dispatch(new Promise(r => r({ type: 'PROMISE_TYPE', payload: {} })));
    dispatch(async () => {
      await new Promise(r => setTimeout(() => r(), 1000))
      return { type: 'FETCH_THERE', payload: { txt3: 'fetch-there success!!!' } }
    });
  }, []);
  return (
    <div className="e-wrapper">
      {/* <h2>The count is {state.count}</h2>
      <div className="e-button" onClick={() => dispatch(store => ({
        type: 'ADD_COUNT',
        payload: {
          count: store.count + 1,
        }
      }))}>ADD ONE</div> */}
      {/* <p>{state.txt1 || 'loading...'}</p>
      <p>{state.txt2 || 'loading...'}</p>
      <p>{state.txt3 || 'loading...'}</p>
      <p>{state.sVal || 'loading...'}</p> */}
      <input type="text" value={state.iVal} onChange={e => dispatch({
        type: 'CHANGE_VALUE',
        payload: {
          iVal: e.target.value,
        }
      })} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
