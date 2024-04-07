import { Position } from "../components/Node";

// https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript
// Thank you stack overflow very cool
export class PriorityQueue<T> {
  _heap: T[];
  _comparator: (a: T, b: T) => boolean;

  constructor(comparator: (a: T, b: T) => boolean) {
    this._heap = [];
    this._comparator = comparator;
  }

  size() {
    return this._heap.length;
  }

  isEmpty() {
    return this.size() == 0;
  }

  peek() {
    return this._heap[this.top()];
  }

  push(...values: T[]) {
    values.forEach((value) => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }

  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > this.top()) {
      this._swap(this.top(), bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }

  top() {
    return 0;
  }

  parent(i: number) {
    return ((i + 1) >> 1) - 1;
  }

  left(i: number) {
    return (i << 1) + 1;
  }

  right(i: number) {
    return (i + 1) << 1;
  }

  _greater(i: number, j: number) {
    return this._comparator(this._heap[i], this._heap[j]);
  }

  _swap(i: number, j: number) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }

  _siftUp() {
    let node = this.size() - 1;
    while (node > this.top() && this._greater(node, this.parent(node))) {
      this._swap(node, this.parent(node));
      node = this.parent(node);
    }
  }

  _siftDown() {
    let node = this.top();
    while (
      (this.left(node) < this.size() && this._greater(this.left(node), node)) ||
      (this.right(node) < this.size() && this._greater(this.right(node), node))
    ) {
      const maxChild =
        this.right(node) < this.size() &&
        this._greater(this.right(node), this.left(node))
          ? this.right(node)
          : this.left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

export class Queue {
  _queue: Position[];
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

  push(...values: Position[]) {
    values.forEach((value) => {
      this._queue.push(value);
    });
    return this._queue.length;
  }

  pop() {
    return this._queue.shift();
  }
}

export const inBounds = (
  maxBoundRow: number,
  maxBoundCol: number,
  row: number,
  col: number
) => {
  return 0 <= row && row < maxBoundRow && 0 <= col && col < maxBoundCol;
};

export const findShortestPath = (
  parents: Position[][],
  end: Position
): Position[] => {
  let current = end;
  const shortestPath = [];

  // While current has a parent, go to its previousNode
  while (current) {
    shortestPath.push(current);
    current = parents[current.row][current.col];
  }

  shortestPath.pop();
  shortestPath.reverse();
  shortestPath.pop();
  return shortestPath;
};
