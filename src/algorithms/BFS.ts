import Algorithm, { DELTA, findShortestPath, findNodeFrom } from "./Algorithm";
import * as Node from "@/lib/Node";
import assert from "../lib/assert";
import Queue from "@/lib/Queue";

const BFS = (): Algorithm => {
  return {
    getName: () => "Breadth First Search",
    run: (grid) => {
      if (grid.length === 0) {
        return { visitedPath: [], shortestPath: [] };
      }

      const traversalPath: Node.Position[] = [];
      const parents: Node.Position[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill(null));
      const visited: boolean[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill(false));

      const start = findNodeFrom(grid, "START");
      assert(start);

      const queue = new Queue<Node.Position>();
      queue.push(start);
      visited[start.row][start.col] = true;

      while (queue.size() > 0) {
        const prevNode = queue.pop()!;
        if (!Node.positionsEquals(prevNode, start)) {
          traversalPath.push(prevNode);
        }

        for (const [dr, dc] of DELTA) {
          const [nextRow, nextCol] = [prevNode.row + dr, prevNode.col + dc];

          if (
            !Node.inBounds(grid, { row: nextRow, col: nextCol }) ||
            grid[nextRow][nextCol].state === "WALL" ||
            visited[nextRow][nextCol]
          )
            continue;

          visited[nextRow][nextCol] = true;
          parents[nextRow][nextCol] = prevNode;

          if (grid[nextRow][nextCol].state === "END") {
            return {
              visitedPath: traversalPath,
              shortestPath: findShortestPath(parents, {
                row: nextRow,
                col: nextCol,
              }),
            };
          }

          queue.push({ row: nextRow, col: nextCol });
        }
      }

      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
};

export default BFS;
