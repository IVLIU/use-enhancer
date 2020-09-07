# use-enhancer

use-enhancer如其名，是一个简单且强大的hooks。它基于中间件模式（没错，它类似于redux中间件模式，但它是基于双向链表而非数组，为什么是链表？因为我想做更多我认为还不错的point）来增强useReducer的dispatch，增强后可以方便的执行异步action或者记录日志等操作。我会提供thunk（类似于redux-thunk），all（类似于promise race），race（类似于promise all）中间件作为例子。

## 安装

```bash
yarn add @ivliu/use-enhancer # or npm install @ivliu/use-enhancer --save
```

## 中间件

我通过中间件的形式来增强dispatch，它编写需要遵循一定的规则（类似于redux中间件形式），一眼看去就是一个复杂的闭包运用。

###  类型声明
```typescript
export type TMiddlewareWithoutAction = <R extends ReducerWithoutAction<any>>(
  store: ReducerStateWithoutAction<R>, 
  dispatch: DispatchWithoutAction
) => (next: TNext) => () => Promise<void>;

export type TMiddleware = <R extends Reducer<any, any>>(
  store: ReducerState<R>, 
  Dispatch: Dispatch<ReducerState<R>>
) => (next: TNext) => (action: ReducerAction<R> | ReducerAction<R>[]) => Promise<void>;

export type TNext = <R extends Reducer<any, any>>(...actions?: ReducerAction<R>[]) => Promise<void>;
```

它有两种形式，一种有action和一种无action版，你可通过闭包访问到store，dispatch（目前感觉是冗余参数，还没用到，也不推荐用），以及next函数。

```typescript
import { TMiddleware } from './type';

export const thunk: TMiddleware = () => next => async action => {
  if(!action) {
    await next();
    return;
  }
  if(typeof action === 'function') {
    action = await action();
  }
  await next(action);
}
```

以上是内置thunk的定义，大家可以做个参考。

## 派生action

我们执行dispatch的时候会传入一个action（它可以是个对象或者函数），我把它定义为源action，会被传入每个middleware的action形参位置。同时你还可以基于当前action计算出另一个action（你如在thunk内，我们根据函数式action计算出对象action），我把它定义为派生action，把它作为入参传入next函数即可，我会通过单向链表把它们链接起来。当然你不需要担心action链会造成过度渲染的问题，我通过batch函数优化了。

## 举个例子吧

```typescript
import { React, FC useReducer } from 'react';
import useEnhancer from '@ivliu/use-enhancer';

const fakeThunk = () => next => async action => {
  if(typeof action === 'function') {
    action = await action();
  }
  await next(action);
}

const fakeLog = () => next => async () => {
  console.log('sorry, i am a fake log.');
  await next();
}

const reducer = (state, action) {
  const { type, payload } = action;
  switch(type) {
    case 'ASYNC_TYPE':
      return { ...state, ...payload };
    default: 
    return state;
  }
}

const App: FC = () => {
  const [state, rawDispatch] = useReducer(reducer, {});
  const dispatch = useEnhancer(
    state,
    rawDispatch,
    fakeThunk,
    fakeLog,
  );
  useEffect(() => {
    dispatch(async () => {
      await new Promise(r => setTimeout(() => r(), 3000));
      return ({ type: 'ASYNC_TYPE', payload: { /* some data */ }})
    })
  }, [])
  return (<p>So handsome, you actually use use-enhancer.</p>)
};
```

另外您还可以把项目clone下来，实际跑一下例子

```bash
git clone 
cd use-enhancer
yarn # or npm i
npm start
cd example
yarn # or npm i
npm start
```
然后打开http://localhost:1234即可看到效果

## 计划

1. 为了更好的执行副作用，我打算把中间件执行分为三个部分，分别是capture，target（已启用），bubble，类似于DOM事件流，其中capture阶段主要是真正dispatch执行前的操作，比如ajax请求等；target阶段是真正的dispatch阶段，不能打断；bubble阶段是dispatch之后的阶段，比如执行之后重新设置页面title，执行时机我打算放在useEffect执行，即页面绘制完毕后异步执行。这也是我采用双向链表的原因，可以方便的打断(敬请期待)。
2. 多个dispatch支持

## 最后
希望大家可以多多提意见，多多star，多多pr。