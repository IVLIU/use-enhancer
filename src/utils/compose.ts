import { check } from './check';
import { TNext } from './type';

type TCompose = (callbacks: TCallback[], options?: Partial<TOptions>) => TLink;
type TCallback = (next: TNext) => TLinkCallback;
type TLinkCallback = (...args: any[]) => Promise<any>;
type TResolve = (value?: unknown) => void;

type TLink = {
  callback: TLinkCallback;
  resolve: TResolve | null;
  prev: TLink;
  next: TLink;
} | null;

type TAction = {
  type: string;
  payload: any;
} | null;

type TEffect = {
  action: TAction;
  next: TEffect | null;
} | null;

type TOptions = {
  onCapture: () => void;
  onTarget: (effect: TEffect) => void;
  onBubble: () => void;
};

export const compose: TCompose = (callbacks, options = {}) => {
  let head: TLink = null;
  let tail: TLink = null;
  let chain: TLink = null;
  let current: TLink = null;
  let effects: TEffect = null;
  let currentEffect: TEffect = null;
  let isExecuting: boolean = false;
  let isDispatchWithoutAction: boolean = false;
  // let isAutoResolve: boolean = true;
  const next: TNext = async (...derivedActions) => {
    if (isExecuting) {
      return;
    }
    if (derivedActions.length > 0) {
      for (const _d of derivedActions) {
        check(_d);
        if (!effects) {
          effects = currentEffect = {
            action: _d,
            next: null,
          };
          continue;
        }
        currentEffect = currentEffect!.next = {
          action: _d,
          next: null,
        };
      }
    }
    if (!current) {
      current = head;
    }
    if ((current = current!.next)) {
      if (isDispatchWithoutAction) {
        await current.callback();
        return;
      }
      await current.callback(effects!.action);
      return;
    }
    try {
      isExecuting = true;
      const { onTarget } = options;
      if (onTarget) {
        onTarget(effects);
      }
    } finally {
      isExecuting = false;
      // todo to break the function and call it in effect.
      // await new Promise(_r => head!.resolve = _r);
    }
  };
  for (let _c of callbacks) {
    if (!chain) {
      head = tail = chain = {
        callback: async action => {
          const { onCapture, onBubble } = options;
          if (onCapture) {
            onCapture();
          }
          if (!action) {
            isDispatchWithoutAction = true;
            await _c(next)();
            if (onBubble) {
              onBubble();
            }
            return;
          }
          effects = currentEffect = {
            action,
            next: null,
          };
          await _c(next)(action);
          if (onBubble) {
            onBubble();
          }
        },
        resolve: null,
        prev: null,
        next: null,
      };
      // Object.defineProperty(head, 'resolve', {
      //   get: function() {
      //     isAutoResolve = false;
      //     return this.resolve;
      //   },
      // });
      continue;
    }
    tail = tail!.next = {
      callback: _c(next),
      resolve: null,
      prev: tail,
      next: null,
    };
  }
  return chain;
};
