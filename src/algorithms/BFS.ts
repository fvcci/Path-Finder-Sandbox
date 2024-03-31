import { NODE_STATE } from "../constants";
import Algorithm, { DELTA } from "./Algorithm";
import { NodeType } from "../components/NodeType";
import { Queue, inBounds, findShortestPath } from "./util";

const BFS = (): Algorithm => {
  return {
    getName: () => "Breadth First Search",
    run: (grid: NodeType[][], start: NodeType) => {
      const steps: NodeType[] = [];
      const parents: NodeType[][] = new Array(grid.length);
      const visited: boolean[][] = new Array(grid.length);

      for (let i = 0; i < grid.length; i++) {
        const parentsRow = new Array(grid[i].length);
        const visitedRow = new Array(grid[i].length);
        for (let j = 0; j < grid.length; j++) {
          parentsRow[j] = null;
          visitedRow[j] = false;
        }
        parents[i] = parentsRow;
        visited[i] = visitedRow;
      }

      const queue = new Queue();
      queue.push(start);
      visited[start.row][start.col] = true;

      while (queue.size() > 0) {
        const prevNode = queue.pop()!;
        if (prevNode !== start) {
          steps.push(prevNode);
        }

        for (const [dr, dc] of DELTA) {
          const [r, c] = [prevNode.row + dr, prevNode.col + dc];

          const adjNode = grid[r]?.[c];

          if (
            !inBounds(grid, r, c) ||
            adjNode.state === NODE_STATE.WALL ||
            visited[r][c]
          )
            continue;

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
    },
  };
};

export default BFS;
