import Algorithm, { DELTA } from "./Algorithm";
import { Node, Position } from "../components/Node";
import { Queue, inBounds, findShortestPath } from "./util";

const BFS = (): Algorithm => {
  return {
    getName: () => "Breadth First Search",
    run: (grid: Node[][], start: Position) => {
      const steps: Position[] = [];
      const parents: Position[][] = new Array(grid.length);
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
            !inBounds(grid.length, grid[0].length, r, c) ||
            adjNode.state === "WALL" ||
            visited[r][c]
          )
            continue;

          visited[r][c] = true;
          parents[r][c] = prevNode;

          queue.push({ row: r, col: c });

          if (adjNode.state !== "END") {
            queue.push({ row: r, col: c });
          } else {
            return {
              steps,
              shortestPath: findShortestPath(parents, { row: r, col: c }),
            };
          }
        }
      }

      return { steps, shortestPath: [] };
    },
  };
};

export default BFS;
