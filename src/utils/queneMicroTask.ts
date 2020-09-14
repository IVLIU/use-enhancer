export const queneMicroTask: (callback: VoidFunction) => void = callback =>
  (window.queueMicrotask || Promise.resolve().then)(callback);
