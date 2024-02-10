import { NODE_STATE, DELTA } from "../constants";
import Algorithm from "./Algorithm";
import { NodeType } from "../PathFindingVisualizer/Node";
import { Queue, inBounds, findShortestPath } from "./util";

export default class BFS extends Algorithm {
  constructor() {
    super("Breadth First Search", "placeholder");
  }

  run(grid: NodeType[][], start: NodeType): { steps: NodeType[]; shortestPath: NodeType[] } {
    let steps: NodeType[] = [];
    let parents: NodeType[][] = new Array(grid.length);
    let visited: boolean[][] = new Array(grid.length);

    for (let i = 0; i < grid.length; i++) {
      let parentsRow = new Array(grid[i].length);
      let visitedRow = new Array(grid[i].length);
      for (let j = 0; j < grid.length; j++) {
        parentsRow[j] = null;
        visitedRow[j] = false;
      }
      parents[i] = parentsRow;
      visited[i] = visitedRow;
    }

    let queue = new Queue();
    queue.push(start);
    visited[start.row][start.col] = true;

    while (queue.size() > 0) {
      const prevNode = queue.pop()!;
      if (prevNode !== start) {
        steps.push(prevNode);
      }

      for (const [dr, dc] of DELTA) {
        let [r, c] = [prevNode.row + dr, prevNode.col + dc];

        let adjNode = grid[r]?.[c];

        if (!inBounds(grid, r, c) || adjNode.state === NODE_STATE.WALL || visited[r][c]) continue;

        visited[r][c] = true;
        parents[r][c] = prevNode;

        queue.push(adjNode);

        if (adjNode.state !== NODE_STATE.END) {
          queue.push(adjNode);
        } else {
          return { steps, shortestPath: findShortestPath(parents, adjNode) };
        }
      }
    }

    return { steps, shortestPath: [] };
  }
}

