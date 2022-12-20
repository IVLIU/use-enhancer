# use-enhancer

use-enhancer可以让useReducer无缝接入redux中间件的小工具

如果你不想用redux，又嫌弃useReducer的dispatch太鸡肋，那不妨尝试下use-enhancer

## 安装

```bash
# install
npm install @ai-indeed/use-enhancer # or yarn add @ai-indeed/use-enhancer
```

## 文档

它提供了一个hook，即useEnhance，具体使用放下见下例（以redux-thunk为例）

```typescript
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
        onClick={() => thunkDispatch(dispatch => dispatch({ type: 'plus' }))}
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

## 注意点

1. 在严格模式下（React.StrictMode）请不要在useEffect中注册saga，否则saga将被注册两次
2. 由于react更新机制和redux存在差异，所以诸如redux-logger之类的插件无法获取newState

## 例子

请参照example

## Gitlab

https://code.ii-ai.tech/ued/use-enhancer

没有权限请联系流川