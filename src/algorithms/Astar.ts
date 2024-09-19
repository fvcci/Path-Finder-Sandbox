import Algorithm, {
  DELTA,
  inBounds,
  findShortestPath,
  PriorityQueue,
  findNodeFrom,
} from "./Algorithm";
import { Node, Position, State } from "../util/Node";
import { assert } from "../util/asserts";

interface AStarNode extends Position {
  f: number;
  g: number;
}

// measurement of how far node a is to node b
const heuristic = (a: Position, b: Position) => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

const AStar = (): Algorithm => {
  return {
    getName: () => "A*",
    run: (grid: Node<State>[][]) => {
      if (grid.length === 0) {
        return { visitedPath: [], shortestPath: [] };
      }

      // Initialize the lists
      const visited: boolean[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill(false));
      const aStarGrid: AStarNode[][] = new Array(grid.length)
        .fill(null)
        .map((_, row) =>
          new Array(grid[0].length).fill(null).map((_, col) => ({
            f: Number.MAX_VALUE,
            g: Number.MAX_VALUE,
            h: Number.MAX_VALUE,
            row,
            col,
          }))
        );
      const traversalPath: Position[] = [];
      const parents: Position[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill(null));

      const start = findNodeFrom(grid, "START");
      const end = findNodeFrom(grid, "END");
      assert(start && end);

      aStarGrid[start.row][start.col] = { f: 0, g: 0, ...start };

      const openList = new PriorityQueue<AStarNode>(
        (a, b) => a.f < b.f || (a.f == b.f && a.g > b.g)
      );
      openList.push(aStarGrid[start.row][start.col]);

      while (!openList.isEmpty()) {
        const { row, col } = openList.pop();
        visited[row][col] = true;

        if (start.row !== row || start.col !== col) {
          traversalPath.push({ row, col });
        }

        for (const [dr, dc] of DELTA) {
          const [rr, cc] = [row + dr, col + dc];
          const reachedEnd = rr === end.row && cc === end.col;

          if (
            !inBounds(grid, { row: rr, col: cc }) ||
            grid[rr][cc].state === "WALL" ||
            visited[rr][cc]
          )
            continue;
          else if (reachedEnd) {
            parents[rr][cc] = { row, col };
            return {
              visitedPath: traversalPath,
              shortestPath: findShortestPath(parents, end),
            };
          }

          // f = g + h
          const gNew = aStarGrid[row][col].g + grid[rr][cc].weight;
          const fNew = gNew + heuristic({ row: rr, col: cc }, end);

          if (aStarGrid[rr][cc].f <= fNew) {
            continue;
          }

          aStarGrid[rr][cc] = {
            ...aStarGrid[rr][cc],
            g: gNew,
            f: fNew,
          };
          openList.push(aStarGrid[rr][cc]);
          parents[rr][cc] = { row, col };
        }
      }

      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
};

export default AStar;
