import Algorithm, { DELTA, findShortestPath, findNodeFrom } from "./Algorithm";
import * as Node from "@/lib/Node";
import assert from "../lib/assert";
import PriorityQueue from "@/lib/PriorityQueue";

interface AStarNode extends Node.Position {
  f: number;
  g: number;
}

export default function MultiSourceAStar(): Algorithm {
  return {
    getName: () => "Multi-Source A*",
    run: (grid) => {
      if (grid.length === 0) {
        return { visitedPath: [], shortestPath: [] };
      }

      const traversalPath: Node.Position[] = [];
      const parents: Node.Position[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill(null));

      const visited: Node.State[][] = new Array(grid.length)
        .fill(null)
        .map(() => new Array(grid[0].length).fill("BASE"));

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

      const comparator = (a: AStarNode, b: AStarNode) =>
        a.f < b.f || (a.f === b.f && a.g > b.g);
      const pq = new PriorityQueue<AStarNode>(comparator);

      aStarGrid[start.row][start.col] = { f: 0, g: 0, ...start };
      aStarGrid[end.row][end.col] = { f: 0, g: 0, ...end };
      visited[start.row][start.col] = "START";
      visited[end.row][end.col] = "END";

      pq.push(aStarGrid[start.row][start.col]);
      pq.push(aStarGrid[end.row][end.col]);

      const closestNodeFromDestMap = new Map<Node.State, AStarNode>([
        ["START", aStarGrid[start.row][start.col]],
        ["END", aStarGrid[end.row][end.col]],
      ]);

      while (!pq.isEmpty()) {
        const curNode = pq.pop();
        if (
          !Node.positionsEquals(start, curNode) &&
          !Node.positionsEquals(end, curNode)
        ) {
          traversalPath.push(curNode);
        }

        for (const [dr, dc] of DELTA) {
          const nextNode = { row: curNode.row + dr, col: curNode.col + dc };

          if (
            !Node.inBounds(grid, nextNode) ||
            grid[nextNode.row][nextNode.col].state === "WALL" ||
            visited[curNode.row][curNode.col] ===
              visited[nextNode.row][nextNode.col]
          )
            continue;

          const foundVisitedFromNextNode =
            visited[nextNode.row][nextNode.col] !== "BASE";
          if (foundVisitedFromNextNode) {
            let nodeFromStart = curNode as Node.Position;
            let nodeFromEnd = nextNode as Node.Position;
            if (visited[curNode.row][curNode.col] === "END") {
              nodeFromStart = nextNode;
              nodeFromEnd = curNode;
            }

            const shortestPathStartHalf = findShortestPath(
              parents,
              nodeFromStart
            );
            if (!Node.positionsEquals(start, nodeFromStart)) {
              shortestPathStartHalf.push(nodeFromStart);
            }

            const shortestPathEndHalf = findShortestPath(parents, nodeFromEnd);
            if (!Node.positionsEquals(end, nodeFromEnd)) {
              shortestPathEndHalf.push(nodeFromEnd);
            }

            // Because traversalPath might not include nextNode
            if (
              !Node.positionsEquals(start, nextNode) &&
              !Node.positionsEquals(end, nextNode)
            ) {
              traversalPath.push(nextNode);
            }

            return {
              visitedPath: traversalPath,
              shortestPath: shortestPathStartHalf.concat(
                shortestPathEndHalf.reverse()
              ),
            };
          }

          const gNew =
            aStarGrid[curNode.row][curNode.col].g +
            grid[nextNode.row][nextNode.col].weight;

          const curNodeState = visited[curNode.row][curNode.col];
          const oppNodeState = curNodeState === "START" ? "END" : "START";
          const closestNode = closestNodeFromDestMap.get(oppNodeState);
          assert(closestNode);
          const fNew = gNew + heuristic(nextNode, closestNode);

          aStarGrid[nextNode.row][nextNode.col] = {
            ...nextNode,
            g: gNew,
            f: fNew,
          };

          if (comparator(aStarGrid[nextNode.row][nextNode.col], closestNode)) {
            closestNodeFromDestMap.set(
              curNodeState,
              aStarGrid[nextNode.row][nextNode.col]
            );
          }

          parents[nextNode.row][nextNode.col] = curNode;
          visited[nextNode.row][nextNode.col] =
            visited[curNode.row][curNode.col];
          pq.push(aStarGrid[nextNode.row][nextNode.col]);
        }
      }

      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
}

const heuristic = (a: Node.Position, b: Node.Position) => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};
