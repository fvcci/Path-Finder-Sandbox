import { NODE_STATE, DELTA } from "../constants";

// Local files
import Algorithm from "./Algorithm";
import { PriorityQueue, inBounds, findShortestPath } from "./util";
import { NodeType } from "../PathFindingVisualizer/Node";

export default class Dijkstra extends Algorithm {
  constructor() {
    super("Dijkstra's Algorithm", "placeholder");
  }

  // Run the algorithm and return the steps and shortest path
  run(
    grid: NodeType[][],
    start: NodeType
  ): { steps: NodeType[]; shortestPath: NodeType[] } {
    let steps: NodeType[] = [];
    let parents: NodeType[][] = new Array(grid.length);

    let dis: number[][] = new Array(grid.length);

    for (let i = 0; i < grid.length; ++i) {
      let parentsRow = new Array(grid[i].length);
      let disRow = new Array(grid[i].length);
      for (let j = 0; j < grid[i].length; ++j) {
        parentsRow[j] = null;
        disRow[j] = Infinity;
      }
      parents[i] = parentsRow;
      dis[i] = disRow;
    }

    // Start fro the start node
    let queue = new PriorityQueue<NodeType>((a, b) => a.weight < b.weight);
    queue.push(start);
    dis[start.row][start.col] = 0;

    while (queue.size() > 0) {
      const prevNode = queue.pop()!;
      if (prevNode !== start) {
        steps.push(prevNode);
      }

      for (const [dr, dc] of DELTA) {
        let [r, c] = [prevNode.row + dr, prevNode.col + dc];

        // Record all the visited nodes in the algorithm
        let adjNode = grid[r]?.[c];

        // Invalid if out of bounds or a wall or is already visited
        if (
          !inBounds(grid, r, c) ||
          adjNode.state === NODE_STATE.WALL ||
          dis[r][c] <= dis[prevNode.row][prevNode.col] + adjNode.weight
        )
          continue;

        // Add the previous distance with the distance now
        dis[r][c] = dis[prevNode.row][prevNode.col] + adjNode.weight;
        // previousNode is a parent node to grid[r][c]
        parents[r][c] = prevNode;

        if (adjNode.state !== NODE_STATE.END) {
          queue.push({ ...adjNode, weight: dis[r][c] });
        } else {
          return { steps, shortestPath: findShortestPath(parents, adjNode) };
        }
      }
    }

    // In this case there was no path to the finish node
    return { steps, shortestPath: [] };
  }
}
