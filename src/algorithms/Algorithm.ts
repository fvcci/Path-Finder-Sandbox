import { Position } from "../components/Node";
import { Node } from "../components/Node";

export default interface Algorithm {
  getName: () => string;
  run: (
    grid: Node[][],
    start: Position,
    end: Position
  ) => { steps: Position[]; shortestPath: Position[] };
}

export const DELTA = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];

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

export const inBounds = (grid: Node[][], position: Position) => {
  return (
    grid.length !== 0 &&
    0 <= position.row &&
    position.row < grid.length &&
    0 <= position.col &&
    position.col < grid[0].length
  );
};

export const findShortestPath = (
  parents: (Position | null)[][],
  end: Position
): Position[] => {
  let current: Position | null = end;
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
