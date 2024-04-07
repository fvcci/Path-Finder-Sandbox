import { NODE_STATE } from "../constants";

// Local files
import Algorithm, { DELTA } from "./Algorithm";
import { PriorityQueue, inBounds, findShortestPath } from "./util";
import { Node, Position } from "../components/Node";

const Dijkstra = (): Algorithm => {
  return {
    getName: () => "Dijkstra's Algorithm",
    run: (grid: Node[][], start: Position) => {
      const steps: Position[] = [];
      const parents: Position[][] = new Array(grid.length);

      const dis: number[][] = new Array(grid.length);

      for (let i = 0; i < grid.length; ++i) {
        const parentsRow = new Array(grid[i].length);
        const disRow = new Array(grid[i].length);
        for (let j = 0; j < grid[i].length; ++j) {
          parentsRow[j] = null;
          disRow[j] = Infinity;
        }
        parents[i] = parentsRow;
        dis[i] = disRow;
      }

      // Start fro the start node
      const queue = new PriorityQueue<Node & Position>(
        (a, b) => a.weight < b.weight
      );
      queue.push({ ...start, weight: -1, state: "node-start" });
      dis[start.row][start.col] = 0;

      while (queue.size() > 0) {
        const prevNode = queue.pop()!;
        if (prevNode !== start) {
          steps.push(prevNode);
        }

        for (const [dr, dc] of DELTA) {
          const [r, c] = [prevNode.row + dr, prevNode.col + dc];

          // Record all the visited nodes in the algorithm
          const adjNode = grid[r]?.[c];

          // Invalid if out of bounds or a wall or is already visited
          if (
            !inBounds(grid.length, grid[0].length, r, c) ||
            adjNode.state === NODE_STATE.WALL ||
            dis[r][c] <= dis[prevNode.row][prevNode.col] + adjNode.weight
          )
            continue;

          // Add the previous distance with the distance now
          dis[r][c] = dis[prevNode.row][prevNode.col] + adjNode.weight;
          // previousNode is a parent node to grid[r][c]
          parents[r][c] = prevNode;

          if (adjNode.state !== NODE_STATE.END) {
            queue.push({
              weight: dis[r][c],
              state: adjNode.state,
              row: r,
              col: c,
            });
          } else {
            return {
              steps,
              shortestPath: findShortestPath(parents, { row: r, col: c }),
            };
          }
        }
      }

      // In this case there was no path to the finish node
      return { steps, shortestPath: [] };
    },
  };
};

export default Dijkstra;
