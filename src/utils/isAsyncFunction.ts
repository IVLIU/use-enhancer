export const isAsyncFunction: (func: any) => boolean = func =>
  typeof func === 'function' && /^async/.test(func.toString());
