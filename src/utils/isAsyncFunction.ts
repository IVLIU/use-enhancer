export const isAsyncFunction: (func: any) => boolean = func =>
  typeof func === 'function' &&
  (Object.prototype.toString.call(func) === '[object AsyncFunction]' ||
    /(^async|await|generator|__awaiter|__generator)/.test(func.toString()));
