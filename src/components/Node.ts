export interface Node {
  weight: number;
  state: State;
}

export interface Position {
  row: number;
  col: number;
}

type State = keyof typeof STATES;

export const STATES = {
  BASE: "w-6 h-6 text-center select-none",
  START: "animate-desination-node bg-green-500",
  END: "animate-desination-node bg-red-500",
  VISITED_APPEAR: "animate-visited-node-appear",
  VISITED_DISAPPEAR: "animate-visited-node-disappear",
  SHORTEST_PATH_APPEAR: "animate-shortest-path-appear",
  SHORTEST_PATH_DISAPPEAR: "animate-shortest-path-disappear",
  WALL_APPEAR: "animate-pop-in-node bg-beige-blue-2",
  WALL_DISAPPEAR: "animate-pop-out-node bg-beige-blue-2",
} as const;

const applyForEachClass = (className: string, f: (x: string) => string) =>
  className.split(" ").map(f).join(" ");
