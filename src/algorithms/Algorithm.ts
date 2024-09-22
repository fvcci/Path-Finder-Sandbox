import * as Node from "@/lib/Node";

export default interface Algorithm {
  getName: () => string;
  run: (grid: Node.Node<Node.State>[][]) => {
    visitedPath: Node.Position[];
    shortestPath: Node.Position[];
  };
}

export const DELTA = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];

export const findNodeFrom = (
  grid: Node.Node<Node.State>[][],
  state: Node.State
): Node.Position | null => {
  let pos: Node.Position | null = null;

  grid.some((row, rowIdx) =>
    row.some((node, colIdx) => {
      if (node.state === state) {
        pos = { row: rowIdx, col: colIdx };
        // Early break
        return true;
      }
    })
  );
  return pos;
};

export const findShortestPath = (
  parents: (Node.Position | null)[][],
  end: Node.Position
): Node.Position[] => {
  let current: Node.Position | null = end;
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
