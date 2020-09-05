type TIsPlainObject = (obj: any) => boolean;

export const isPlainObject: TIsPlainObject = obj => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  let proto = obj;
  while(Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
