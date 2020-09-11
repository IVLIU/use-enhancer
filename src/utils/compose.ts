import { check } from './check';
import { TNext } from './type';

type TCompose = (callbacks: TCallback[], options?: Partial<TOptions>) => TLink;
type TCallback = ((next: TNext) => TLinkCallback) & { __REDUX__?: boolean };
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
  onTarget: (effects: TEffect) => void;
  onBubble: () => void;
};

export const compose: TCompose = (callbacks, options = {}) => {
  let head: TLink = null;
  let tail: TLink = null;
  let chain: TLink = null;
  let current: TLink = null;
  let effects: TEffect = null;
  // let nextTickEffects: TEffect = null;
  let currentEffect: TEffect = null;
  let isExecuting: boolean = false;
  let isDispatchWithoutAction: boolean = false;
  // let isAutoResolve: boolean = true;
  const setEffects: (action: any) => void = action => {
    if (!effects) {
      effects = currentEffect = {
        action,
        next: null,
      };
      return;
    }
    currentEffect = currentEffect!.next = {
      action,
      next: null,
    };
  };
  const next: TNext = async (...derivedActions) => {
    if (isExecuting) {
      return;
    }
    if (derivedActions.length > 0) {
      for (const _d of derivedActions) {
        check(_d);
        setEffects(_d);
      }
    }
    if (!current) {
      current = head;
    }
    if ((current = current!.next)) {
      if (isDispatchWithoutAction || !effects) {
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
      // todo 后期换为promise，兼容性有问题
      queueMicrotask(() => {
        isExecuting = false;
        effects = null;
        // todo to break the function and call it in effect.
        // await new Promise(_r => head!.resolve = _r);
      });
    }
  };
  for (let _c of callbacks) {
    if (!chain) {
      head = tail = chain = {
        callback: async action => {
          const { onCapture, onBubble } = options;
          if (!effects && onCapture) {
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
          setEffects(action);
          await _c(next)(action);
          if (!effects && onBubble) {
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
