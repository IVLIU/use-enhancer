export const isPromise: (p: any) => boolean = p =>
  p !== null && typeof p === 'object' && typeof p.then === 'function';
