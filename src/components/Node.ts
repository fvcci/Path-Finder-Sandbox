export interface Node {
  weight: number;
  state: State;
}

export interface Position {
  row: number;
  col: number;
}

export type State = keyof typeof STATE_STYLES;

export const STATE_STYLES = {
  BASE: "w-6 h-6 text-center select-none",
  START: "animate-desination-node bg-green-500",
  END: "animate-desination-node bg-red-500",
  VISITED: "animate-visited-node-appear",
  VISITED_DISAPPEAR: "animate-visited-node-disappear",
  SHORTEST_PATH: "animate-shortest-path-appear",
  SHORTEST_PATH_DISAPPEAR: "animate-shortest-path-disappear",
  WALL: "animate-pop-in-node bg-primary-2",
  WALL_DISAPPEAR: "animate-pop-out-node bg-primary-2",
} as const;
