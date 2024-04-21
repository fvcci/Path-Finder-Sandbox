export interface Node {
  weight: number;
  state: State;
}

export interface Position {
  row: number;
  col: number;
}

export const DISAPPEAR_STATE = (
  | "VISITED_DISAPPEAR"
  | "SHORTEST_PATH_DISAPPEAR"
  | "WALL_DISAPPEAR"
) &
  State;

export type State = keyof typeof STATE_STYLES;

export const STATE_STYLES = {
  BASE: "w-6 h-6 relative text-center select-none",
  START: "animate-destination-node bg-green-500",
  END: "animate-destination-node bg-red-500",
  VISITED: "animate-visited-node-appear",
  VISITED_DISAPPEAR: "animate-visited-node-disappear",
  SHORTEST_PATH: "animate-shortest-path-node-appear bg-node-visited-3",
  SHORTEST_PATH_DISAPPEAR: "animate-shortest-path-node-disappear",
  WALL: "animate-pop-in-node bg-node-wall",
  WALL_DISAPPEAR: "animate-pop-out-node bg-node-wall",
} as const;

export const disappear = (stateStyle: State): State => {
  switch (stateStyle) {
    case "VISITED":
      return "VISITED_DISAPPEAR";
    case "SHORTEST_PATH":
      return "SHORTEST_PATH_DISAPPEAR";
    case "WALL":
      return "WALL_DISAPPEAR";
  }
  return stateStyle;
};

export const DISAPPEAR_ANIMATION_DURATION_MILLI_SECS = 1500;
