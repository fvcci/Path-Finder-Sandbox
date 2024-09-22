import { Extends } from "./types";

export interface Node<T extends State> {
  weight: number;
  state: T;
}

export interface Position {
  row: number;
  col: number;
}

export const positionsEquals = (p1: Position, p2: Position) => {
  return p1.row === p2.row && p1.col === p2.col;
};

export type State =
  | "START"
  | "END"
  | "BASE"
  | "WALL"
  | "WALL_VANISH"
  | "VISITED_PATH"
  | "VISITED_PATH_VANISH"
  | "SHORTEST_PATH"
  | "SHORTEST_PATH_VANISH";

export type Obstruction = Extends<State, "BASE" | "WALL">;

export const STATE_STYLES: Record<State, string> = {
  BASE: "w-6 h-6 relative text-center select-none",
  START: "animate-destination-node bg-green-500",
  END: "animate-destination-node bg-red-500",
  VISITED_PATH: "animate-visited-node-appear",
  VISITED_PATH_VANISH: "animate-visited-node-vanish",
  SHORTEST_PATH: "animate-shortest-path-node-appear bg-node-visited-3",
  SHORTEST_PATH_VANISH: "animate-shortest-path-node-vanish",
  WALL: "animate-pop-in-node bg-node-wall",
  WALL_VANISH: "animate-pop-out-node bg-node-wall",
};

export const vanishPathFrom = (state: State): State => {
  switch (state) {
    case "VISITED_PATH":
      return "VISITED_PATH_VANISH";
    case "SHORTEST_PATH":
      return "SHORTEST_PATH_VANISH";
  }
  return state;
};

export const toggleObstructionVanishState = (
  node: Node<State>,
  brush: Node<Obstruction>
): Node<State> => {
  switch (node.state) {
    case "BASE":
    case "WALL_VANISH":
    case "VISITED_PATH_VANISH":
    case "SHORTEST_PATH_VANISH":
      return brush;
    case "WALL":
      return { weight: 0, state: "WALL_VANISH" };
  }
  return node;
};

const PATHS: State[] = ["VISITED_PATH", "SHORTEST_PATH"];

export const isPath = (state: State) => {
  return PATHS.includes(state);
};

const ANIMATION_STATES: State[] = [
  "WALL_VANISH",
  "VISITED_PATH",
  "VISITED_PATH_VANISH",
  "SHORTEST_PATH",
  "SHORTEST_PATH_VANISH",
];

export const convertAnimationToBaseState = (state: State) => {
  return ANIMATION_STATES.includes(state) ? "BASE" : state;
};

const DESTINATIONS: State[] = ["START", "END"];

export const isDestination = (state: State) => {
  return DESTINATIONS.includes(state);
};

export const VANISH_ANIMATION_DURATION_MILLI_SECS = 1500;
export const APPEAR_ANIMATION_DURATION_MILLI_SECS = 2000;

export const inBounds = (
  grid: Node<State>[][] | null,
  position: Position | null
): boolean => {
  return (
    !position ||
    !grid ||
    (grid.length !== 0 &&
      0 <= position.row &&
      position.row < grid.length &&
      0 <= position.col &&
      position.col < grid[0].length)
  );
};
