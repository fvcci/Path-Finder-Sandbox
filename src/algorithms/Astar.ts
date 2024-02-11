import { NODE_STATE, DELTA } from "../constants";
import Algorithm from "./Algorithm";
import { NodeType } from "../components/Node";
import { inBounds, findShortestPath, PriorityQueue } from "./util";

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

export default class Astar extends Algorithm {
  constructor() {
    super("A*", "placeholder");
  }

  findEnd(grid: NodeType[][]): NodeType {
    for (let r = 0; r < grid.length; ++r) {
      for (let c = 0; c < grid[0].length; ++c) {
        if (grid[r][c].state === NODE_STATE.END) {
          return grid[r][c];
        }
      }
    }

    return { row: -1, col: -1, weight: 1, state: "" };
  }

  // measurement of how far node a is to node b
  heuristic(a: NodeType, b: NodeType): number {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }

  run(
    grid: NodeType[][],
    startNode: NodeType
  ): { steps: NodeType[]; shortestPath: NodeType[] } {
    // Initialize the lists
    const visited: boolean[][] = new Array(grid.length);
    const aStarGrid: AStarNode[][] = new Array(grid.length);
    const steps: NodeType[] = [];
    const parents: NodeType[][] = [];

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
    aStarGrid[startNode.row][startNode.col] = { f: 0, g: 0, h: 0 };

    // open list using priority queue of type F
    const openList = new PriorityQueue<F>((a: F, b: F) => a.f < b.f);
    openList.push({ f: 0, r: startNode.row, c: startNode.col });

    const endNode = this.findEnd(grid);

    while (!openList.isEmpty()) {
      const { r, c } = openList.pop();
      visited[r][c] = true;

      if (startNode.row !== r || startNode.col !== c) {
        steps.push(grid[r][c]);
      }

      // use delta to find neighbours
      for (const [dr, dc] of DELTA) {
        const [rr, cc] = [r + dr, c + dc];

        // Invalid if out of bounds or a wall or is already visited
        if (
          !inBounds(grid, rr, cc) ||
          grid[rr][cc].state === NODE_STATE.WALL ||
          visited[rr][cc]
        )
          continue;
        // if destination cell is the same as current successor
        else if (rr === endNode.row && cc === endNode.col) {
          parents[rr][cc] = grid[r][c];
          return { steps, shortestPath: findShortestPath(parents, endNode) };
        }

        const gNew = aStarGrid[r][c].g + grid[rr][cc].weight;
        const hNew = this.heuristic(grid[rr][cc], endNode);
        const fNew = gNew + hNew;

        if (aStarGrid[rr][cc].f >= fNew) {
          // update neighbour node
          aStarGrid[rr][cc] = {
            f: fNew,
            g: gNew,
            h: hNew,
          };
          openList.push({ f: fNew, r: rr, c: cc });
          parents[rr][cc] = grid[r][c];
        }
      }
    }

    return { steps, shortestPath: [] };
  }
}
