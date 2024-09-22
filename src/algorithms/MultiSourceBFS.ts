import Algorithm, {
  DELTA,
  Queue,
  findShortestPath,
  findNodeFrom,
} from "./Algorithm";
import * as Node from "@/lib/Node";
import assert from "../lib/assert";

const MultiSourceBFS = (): Algorithm => {
  return {
    getName: () => "Multi-Source Breadth First Search",
    run: (grid: Node.Node<Node.State>[][]) => {
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

      const start = findNodeFrom(grid, "START");
      const end = findNodeFrom(grid, "END");
      assert(start && end);

      const queue = new Queue();
      queue.push(start);
      queue.push(end);
      visited[start.row][start.col] = "START";
      visited[end.row][end.col] = "END";

      while (queue.size() > 0) {
        const curNode = queue.pop()!;
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
            let nodeFromStart = curNode;
            let nodeFromEnd = nextNode;
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

          parents[nextNode.row][nextNode.col] = curNode;
          visited[nextNode.row][nextNode.col] =
            visited[curNode.row][curNode.col];
          queue.push(nextNode);
        }
      }

      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
};

export default MultiSourceBFS;
