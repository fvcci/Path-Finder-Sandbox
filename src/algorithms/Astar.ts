import Algorithm, {
  DELTA,
  inBounds,
  findShortestPath,
  PriorityQueue,
} from "./Algorithm";
import { Node, Position } from "../components/Node";

interface AStarNode {
  f: number;
  g: number;
  h: number;
}

interface F {
  f: number;
  r: number;
  c: number;
}

// measurement of how far node a is to node b
const heuristic = (a: Position, b: Position) => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

const AStar = (): Algorithm => {
  return {
    getName: () => "A*",
    run: (grid: Node[][], start: Position, end: Position) => {
      if (grid.length === 0) {
        return { traversalPath: [], shortestPath: [] };
      }

      // Initialize the lists
      const visited: boolean[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill(false));
      const aStarGrid: AStarNode[][] = new Array(grid.length)
        .fill(null)
        .map(() =>
          new Array(grid[0].length).map(() => ({
            f: Number.MAX_VALUE,
            g: Number.MAX_VALUE,
            h: Number.MAX_VALUE,
          }))
        );
      const traversalPath: Position[] = [];
      const parents: Position[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill(null));

      // Initialize first node
      aStarGrid[start.row][start.col] = { f: 0, g: 0, h: 0 };

      // open list using priority queue of type F
      const openList = new PriorityQueue<F>((a: F, b: F) => a.f < b.f);
      openList.push({ f: 0, r: start.row, c: start.col });

      while (!openList.isEmpty()) {
        const { r, c } = openList.pop();
        visited[r][c] = true;

        if (start.row !== r || start.col !== c) {
          traversalPath.push({ row: r, col: c });
        }

        // use delta to find neighbours
        for (const [dr, dc] of DELTA) {
          const [rr, cc] = [r + dr, c + dc];
          const reachedEnd = rr === end.row && cc === end.col;

          // Invalid if out of bounds or a wall or is already visited
          if (
            !inBounds(grid, { row: rr, col: cc }) ||
            grid[rr][cc].state === "WALL" ||
            visited[rr][cc]
          )
            continue;
          // if destination cell is the same as current successor
          else if (reachedEnd) {
            parents[rr][cc] = { row: r, col: c };
            return {
              traversalPath,
              shortestPath: findShortestPath(parents, { row: rr, col: cc }),
            };
          }

          const gNew = aStarGrid[r][c].g + grid[rr][cc].weight;
          const hNew = heuristic({ row: rr, col: cc }, { row: rr, col: cc });
          const fNew = gNew + hNew;

          if (aStarGrid[rr][cc].f >= fNew) {
            // update neighbour node
            aStarGrid[rr][cc] = {
              f: fNew,
              g: gNew,
              h: hNew,
            };
            openList.push({ f: fNew, r: rr, c: cc });
            parents[rr][cc] = { row: r, col: c };
          }
        }
      }

      return { traversalPath, shortestPath: [] };
    },
  };
};

export default AStar;
