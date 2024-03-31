import { NodeType } from "../components/NodeType";

export default abstract class LAlgorithm {
  name: string;
  info: string;

  constructor(name: string, info: string) {
    this.name = name;
    this.info = info;
  }

  abstract run(
    grid: NodeType[][],
    startNode: NodeType
  ): { steps: NodeType[]; shortestPath: NodeType[] };
}

export interface IAlgorithm {
  getName: () => string;
  getInfo: () => string;
  run: (
    grid: NodeType[][],
    startNode: NodeType
  ) => { steps: NodeType[]; shortestPath: NodeType[] };
}

export const DELTA = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];
