import { NodeType } from "../PathFindingVisualizer/Node";

export default abstract class Algorithm {
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
