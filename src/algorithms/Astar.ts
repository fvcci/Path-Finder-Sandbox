import { NODE_STATE } from "../constants";
import Algorithm, { DELTA } from "./Algorithm";
import { Node } from "../components/Node";
import { inBounds, findShortestPath, PriorityQueue } from "./util";
import { Position } from "../components/Node";
import { assert } from "../asserts";

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

const findEnd = (grid: Node[][]): Position | null => {
  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid[0].length; ++c) {
      if (grid[r][c].state === NODE_STATE.END) {
        return { row: r, col: c };
      }
    }
  }

  return null;
};

// measurement of how far node a is to node b
const heuristic = (a: Position, b: Position) => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

const AStar = (): Algorithm => {
  return {
    getName: () => "A*",
    run: (grid: Node[][], start: Position) => {
      // Initialize the lists
      const visited: boolean[][] = new Array(grid.length);
      const aStarGrid: AStarNode[][] = new Array(grid.length);
      const steps: Position[] = [];
      const parents: Position[][] = [];

      for (let r = 0; r < grid.length; ++r) {
        const parentsRow = new Array(grid[0].length);
        visited[r] = new Array(grid[0].length);
        aStarGrid[r] = new Array(grid[0].length);
        for (let c = 0; c < grid[0].length; ++c) {
          visited[r][c] = false;
          aStarGrid[r][c] = {
            f: Number.MAX_VALUE,
            g: Number.MAX_VALUE,
            h: Number.MAX_VALUE,
          };
          parentsRow[c] = null;
        }
        parents[r] = parentsRow;
      }

      // Initialize first node
      aStarGrid[start.row][start.col] = { f: 0, g: 0, h: 0 };

      // open list using priority queue of type F
      const openList = new PriorityQueue<F>((a: F, b: F) => a.f < b.f);
      openList.push({ f: 0, r: start.row, c: start.col });

      const endNode = findEnd(grid)!;
      assert(!!endNode);

      while (!openList.isEmpty()) {
        const { r, c } = openList.pop();
        visited[r][c] = true;

        if (start.row !== r || start.col !== c) {
          steps.push({ row: r, col: c });
        }

        // use delta to find neighbours
        for (const [dr, dc] of DELTA) {
          const [rr, cc] = [r + dr, c + dc];

          // Invalid if out of bounds or a wall or is already visited
          if (
            !inBounds(grid.length, grid[0].length, rr, cc) ||
            grid[rr][cc].state === NODE_STATE.WALL ||
            visited[rr][cc]
          )
            continue;
          // if destination cell is the same as current successor
          else if (rr === endNode.row && cc === endNode.col) {
            parents[rr][cc] = { row: r, col: c };
            return { steps, shortestPath: findShortestPath(parents, endNode) };
          }

          const gNew = aStarGrid[r][c].g + grid[rr][cc].weight;
          const hNew = heuristic({ row: rr, col: cc }, endNode);
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

      return { steps, shortestPath: [] };
    },
  };
};

export default AStar;
