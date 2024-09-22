import Algorithm from "./Algorithm";
import AStar from "./AStar";
import BFS from "./BFS";
import DFS from "./DFS";
import Dijkstra from "./Dijkstra";
import MultiSourceAStar from "./MultiSourceAStar";
import MultiSourceBFS from "./MultiSourceBFS";

export type { Algorithm };
export const ALGORITHMS = [
  BFS(),
  Dijkstra(),
  AStar(),
  DFS(),
  MultiSourceBFS(),
  MultiSourceAStar(),
];
