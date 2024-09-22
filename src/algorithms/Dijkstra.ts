import Algorithm, {
  DELTA,
  PriorityQueue,
  inBounds,
  findShortestPath,
  findNodeFrom,
} from "./Algorithm";
import { Node, Position, State } from "../lib/Node";
import { assert } from "../lib/asserts";

const Dijkstra = (): Algorithm => {
  return {
    getName: () => "Dijkstra's Algorithm",
    run: (grid: Node<State>[][]) => {
      if (grid.length === 0) {
        return { visitedPath: [], shortestPath: [] };
      }

      const traversalPath: Position[] = [];
      const parents: (Position | null)[][] = new Array(grid.length)
        .fill(undefined)
        .map(() => new Array(grid[0].length).fill(null));

      const dis: number[][] = new Array(grid.length)
        .fill(undefined)
        .map(() => new Array(grid[0].length).fill(Infinity));

      // Start fro the start node
      const queue = new PriorityQueue<Node<State> & Position>(
        (a, b) => a.weight < b.weight
      );
      const start = findNodeFrom(grid, "START");
      assert(start);

      queue.push({ ...start, weight: -1, state: "START" });
      dis[start.row][start.col] = 0;

      while (queue.size() > 0) {
        const prevNode = queue.pop();
        if (prevNode.row !== start.row || prevNode.col !== start.col) {
          traversalPath.push(prevNode);
        }
        for (const [dr, dc] of DELTA) {
          const [r, c] = [prevNode.row + dr, prevNode.col + dc];

          // Record all the visited nodes in the algorithm
          // Invalid if out of bounds or a wall or is already visited
          if (
            !inBounds(grid, { row: r, col: c }) ||
            grid[r][c].state === "WALL" ||
            dis[r][c] <= dis[prevNode.row][prevNode.col] + grid[r][c].weight
          ) {
            continue;
          }
          // Add the previous distance with the distance now
          dis[r][c] = dis[prevNode.row][prevNode.col] + grid[r][c].weight;
          // previousNode is a parent node to grid[r][c]
          parents[r][c] = prevNode;

          if (grid[r][c].state === "END") {
            return {
              visitedPath: traversalPath,
              shortestPath: findShortestPath(parents, { row: r, col: c }),
            };
          }

          queue.push({
            row: r,
            col: c,
            weight: dis[r][c],
            state: grid[r][c].state,
          });
        }
      }

      // In this case there was no path to the finish node
      return { visitedPath: traversalPath, shortestPath: [] };
    },
  };
};

export default Dijkstra;
