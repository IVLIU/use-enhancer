export const queneMacroTask: (callback: VoidFunction) => void = callback => {
  if (window.MessageChannel) {
    const { port1, port2 } = new MessageChannel();
    port1.postMessage(null);
    port2.onmessage = callback;
    return;
  }
  setTimeout(callback, 0);
};
