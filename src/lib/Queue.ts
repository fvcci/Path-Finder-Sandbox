export default class Queue<T> {
  _queue: T[];
  constructor() {
    this._queue = [];
  }

  size() {
    return this._queue.length;
  }

  isEmpty() {
    return this._queue.length == 0;
  }

  peek() {
    return this._queue[0];
  }

  push(...values: T[]) {
    values.forEach((value) => {
      this._queue.push(value);
    });
    return this._queue.length;
  }

  pop() {
    return this._queue.shift();
  }
}
