import { NodeType } from "../components/NodeType";

export default interface Algorithm {
  getName: () => string;
  run: (
    grid: NodeType[][],
    start: NodeType
  ) => { steps: NodeType[]; shortestPath: NodeType[] };
}

export const DELTA = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];
