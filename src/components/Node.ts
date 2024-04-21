export interface Node {
  weight: number;
  state: State;
}

export interface Position {
  row: number;
  col: number;
}

export type State =
  | "BASE"
  | "START"
  | "END"
  | "VISITED"
  | "VISITED_DISAPPEAR"
  | "SHORTEST_PATH"
  | "SHORTEST_PATH_DISAPPEAR"
  | "WALL"
  | "WALL_REMOVE";

export const STATE_STYLES: Record<State, string> = {
  BASE: "w-6 h-6 relative text-center select-none",
  START: "animate-destination-node bg-green-500",
  END: "animate-destination-node bg-red-500",
  VISITED: "animate-visited-node-appear",
  VISITED_DISAPPEAR: "animate-visited-node-disappear",
  SHORTEST_PATH: "animate-shortest-path-node-appear bg-node-visited-3",
  SHORTEST_PATH_DISAPPEAR: "animate-shortest-path-node-disappear",
  WALL: "animate-pop-in-node bg-node-wall",
  WALL_REMOVE: "animate-pop-out-node bg-node-wall",
};

export const STATE_ANIMATION_DURATIONS_MILLI_SECS: Record<State, number> = {
  BASE: 0,
  START: 0,
  END: 0,
  VISITED: 2000,
  VISITED_DISAPPEAR: 1500,
  SHORTEST_PATH: 1500,
  SHORTEST_PATH_DISAPPEAR: 1500,
  WALL: 0,
  WALL_REMOVE: 0,
};

export const disappearFrom = (stateStyle: State): State => {
  switch (stateStyle) {
    case "VISITED":
      return "VISITED_DISAPPEAR";
    case "SHORTEST_PATH":
      return "SHORTEST_PATH_DISAPPEAR";
  }
  return stateStyle;
};

export const DISAPPEAR_ANIMATION_DURATION_MILLI_SECS = 1500;
