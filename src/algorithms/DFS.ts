import Algorithm, { DELTA, findShortestPath, findNodeFrom } from "./Algorithm";
import * as Node from "@/lib/Node";
import assert from "../lib/assert";

export default function DFS(): Algorithm {
  return {
    getName: () => "Depth First Search",
    run: (grid: Node.Node<Node.State>[][]) => {
      if (grid.length === 0) {
        return { visitedPath: [], shortestPath: [] };
      }

      const traversalPath: Node.Position[] = [];
      const parents: Node.Position[][] = new Array(grid.length);
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

      const start = findNodeFrom(grid, "START");
      assert(start);

      const stack: Node.Position[] = [];
      stack.push(start);
      visited[start.row][start.col] = true;

      while (stack.length > 0) {
        const prevNode = stack.pop()!;
        if (!Node.positionsEquals(start, prevNode)) {
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

          stack.push({ row: nextRow, col: nextCol });
        }
      }

      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
}
