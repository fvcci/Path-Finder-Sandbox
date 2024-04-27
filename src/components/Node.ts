export interface Node<T extends State> {
  weight: number;
  state: T;
}

export interface Position {
  row: number;
  col: number;
}

export type State =
  | "START"
  | "END"
  | "BASE"
  | "WALL"
  | "WALL_DISAPPEAR"
  | PathState;

export type PathState = (typeof PathStates)[number];

export const isPathState = (state: State) => {
  return PathStates.some((pathState) => pathState === state);
};

const PathStates = [
  "VISITED_PATH",
  "VISITED_PATH_DISAPPEAR",
  "SHORTEST_PATH",
  "SHORTEST_PATH_DISAPPEAR",
] as const;

export type Obstruction = ("BASE" | "WALL") & State;

export const STATE_STYLES: Record<State, string> = {
  BASE: "w-6 h-6 relative text-center select-none",
  START: "animate-destination-node bg-green-500",
  END: "animate-destination-node bg-red-500",
  VISITED_PATH: "animate-visited-node-appear",
  VISITED_PATH_DISAPPEAR: "animate-visited-node-disappear",
  SHORTEST_PATH: "animate-shortest-path-node-appear bg-node-visited-3",
  SHORTEST_PATH_DISAPPEAR: "animate-shortest-path-node-disappear",
  WALL: "animate-pop-in-node bg-node-wall",
  WALL_DISAPPEAR: "animate-pop-out-node bg-node-wall",
};

export const disappearPathFrom = (stateStyle: State): State => {
  switch (stateStyle) {
    case "VISITED_PATH":
      return "VISITED_PATH_DISAPPEAR";
    case "SHORTEST_PATH":
      return "SHORTEST_PATH_DISAPPEAR";
  }
  return stateStyle;
};

export const DISAPPEAR_ANIMATION_DURATION_MILLI_SECS = 1500;
export const APPEAR_ANIMATION_DURATION_MILLI_SECS = 2000;
