import Algorithm, {
  DELTA,
  findShortestPath,
  PriorityQueue,
  findNodeFrom,
} from "./Algorithm";
import * as Node from "@/lib/Node";
import assert from "../lib/assert";

interface AStarNode extends Node.Position {
  f: number;
  g: number;
}

// measurement of how far node a is to node b
export default function AStar(): Algorithm {
  return {
    getName: () => "A*",
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
      const aStarGrid: AStarNode[][] = new Array(grid.length)
        .fill(null)
        .map((_, row) =>
          new Array(grid[0].length).fill(null).map((_, col) => ({
            f: Number.MAX_VALUE,
            g: Number.MAX_VALUE,
            row,
            col,
          }))
        );
      const start = findNodeFrom(grid, "START");
      const end = findNodeFrom(grid, "END");
      assert(start && end);

      aStarGrid[start.row][start.col] = { f: 0, g: 0, ...start };

      const openList = new PriorityQueue<AStarNode>(
        (a, b) => a.f < b.f || (a.f == b.f && a.g > b.g)
      );
      openList.push(aStarGrid[start.row][start.col]);

      while (!openList.isEmpty()) {
        const curNode = openList.pop();
        visited[curNode.row][curNode.col] = true;

        if (!Node.positionsEquals(start, curNode)) {
          traversalPath.push(curNode);
        }

        for (const [dr, dc] of DELTA) {
          const nextNode = { row: curNode.row + dr, col: curNode.col + dc };
          const reachedEnd = Node.positionsEquals(end, nextNode);

          if (
            !Node.inBounds(grid, nextNode) ||
            grid[nextNode.row][nextNode.col].state === "WALL" ||
            visited[nextNode.row][nextNode.col]
          )
            continue;
          else if (reachedEnd) {
            parents[nextNode.row][nextNode.col] = curNode;
            return {
              visitedPath: traversalPath,
              shortestPath: findShortestPath(parents, end),
            };
          }

          // f = g + h
          const gNew =
            aStarGrid[curNode.row][curNode.col].g +
            grid[nextNode.row][nextNode.col].weight;
          const fNew = gNew + heuristic(nextNode, end);

          if (aStarGrid[nextNode.row][nextNode.col].f <= fNew) {
            continue;
          }

          aStarGrid[nextNode.row][nextNode.col] = {
            ...nextNode,
            g: gNew,
            f: fNew,
          };
          openList.push(aStarGrid[nextNode.row][nextNode.col]);
          parents[nextNode.row][nextNode.col] = curNode;
        }
      }

      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
}

const heuristic = (a: Node.Position, b: Node.Position) => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};
