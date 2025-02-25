export type Key<T> = T extends unknown[] ? number : keyof T;
type Value<T, K extends Key<T>> = T extends unknown[]
  ? T[number]
  : K extends keyof T
  ? T[K]
  : never;

export class Path<T, K extends Key<T> = Key<T>> {
  constructor(key: K, private path = "") {
    if (path) {
      this.path += ".";
    }
    this.path += (key as string);
  }

  concat<NK extends Key<Value<T, K>>>(key: NK) {
    return new Path<Value<T, K>>(key, this.path);
  }

  toString() {
    return this.path;
  }
}