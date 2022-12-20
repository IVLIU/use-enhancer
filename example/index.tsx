import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { useEnhance } from '../.';
import { AnyAction } from '../dist/type';

const reducer: React.Reducer<number, { type: 'plus' | 'minus' }> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'plus':
      return state + 1;
    case 'minus':
      return state - 1;
    default:
      return state;
  }
};

const App = () => {
  // reducer
  const [rawState, rawDispatch] = React.useReducer(reducer, 0);
  // enhance
  const [count, dispatch] = useEnhance(rawState, rawDispatch, thunk);
  // thunk dispatch
  const thunkDispatch = dispatch as ThunkDispatch<number, null, AnyAction>;
  return (
    <>
      <p>{count}</p>
      <button
        onClick={() =>
          thunkDispatch((dispatch, getState) => {
            console.log(getState());
            return dispatch({ type: 'plus' });
          })
        }
      >
        plus
      </button>
      <button
        onClick={() => thunkDispatch(dispatch => dispatch({ type: 'minus' }))}
      >
        minus
      </button>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
