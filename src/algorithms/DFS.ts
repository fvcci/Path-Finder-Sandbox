import Algorithm, {
  DELTA,
  inBounds,
  findShortestPath,
  findNodeFrom,
} from "./Algorithm";
import { Node, Position, State } from "../util/Node";
import { assert } from "../util/asserts";

const DFS = (): Algorithm => {
  return {
    getName: () => "Depth First Search",
    run: (grid: Node<State>[][]) => {
      if (grid.length === 0) {
        return { visitedPath: [], shortestPath: [] };
      }

      const traversalPath: Position[] = [];
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

      const start = findNodeFrom(grid, "START");
      assert(start);

      const stack: Position[] = [];
      stack.push(start);
      visited[start.row][start.col] = true;

      while (stack.length > 0) {
        const prevNode = stack.pop()!;
        if (prevNode !== start) {
          traversalPath.push(prevNode);
        }

        for (const [dr, dc] of DELTA) {
          const [r, c] = [prevNode.row + dr, prevNode.col + dc];

          const adjNode = grid[r]?.[c];

          if (
            !inBounds(grid, { row: r, col: c }) ||
            adjNode.state === "WALL" ||
            visited[r][c]
          )
            continue;

          visited[r][c] = true;
          parents[r][c] = prevNode;

          stack.push({ row: r, col: c });

          if (adjNode.state !== "END") {
            stack.push({ row: r, col: c });
          } else {
            return {
              visitedPath: traversalPath,
              shortestPath: findShortestPath(parents, { row: r, col: c }),
            };
          }
        }
      }

      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
};

export default DFS;
