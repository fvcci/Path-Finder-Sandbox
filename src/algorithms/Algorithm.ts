import { Position } from "../components/Node";
import { Node } from "../components/Node";

export default interface Algorithm {
  getName: () => string;
  run: (
    grid: Node[][],
    start: Position
  ) => { steps: Position[]; shortestPath: Position[] };
}

export const DELTA = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];
