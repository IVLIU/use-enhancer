import { TMiddleware, TMiddlewareWithoutAction } from './../middlewares/type';
import { TNext } from './type';

type TCompose = (callbacks: TCallback[]) => TLink;
type TCallback = ReturnType<TMiddleware | TMiddlewareWithoutAction>;
type TLinkCallback = ReturnType<TCallback>;

type TLink = {
  callback: TLinkCallback;
  next: TLink;
} | null;

export const compose: TCompose = callbacks => {
  let head: TLink = null;
  let tail: TLink = null;
  let chain: TLink = null;
  let current: TLink = null;
  const next: TNext = async () => {
    if (!current) {
      current = head;
    }
    if ((current = current!.next)) {
      await current.callback({});
      return;
    }
  };
  for (let _c of callbacks) {
    if (!chain) {
      head = tail = chain = {
        callback: _c(next),
        next: null,
      };
      continue;
    }
    tail = tail!.next = {
      callback: _c(next),
      next: null,
    };
  }
  return chain;
};
