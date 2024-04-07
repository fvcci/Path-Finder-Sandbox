export interface Node {
  weight: number;
  state: string;
}

export interface Position {
  row: number;
  col: number;
}

export type State = AppearState | DisappearState;

type AppearState = (typeof APPEAR_STATES)[number];
const APPEAR_STATES = [
  "node",
  "node-start",
  "node-end",
  "node-visited",
  "node-shortest-path",
  "node-wall",
  "node-weighted-1",
  "node-weighted-2",
  "node-weighted-3",
] as const;

type DisappearState = (typeof DISAPPEAR_STATES)[number];
const DISAPPEAR_STATES = [
  "node",
  "node-start",
  "node-end",
  "node-visited-reverse",
  "node-shortest-path-reverse",
  "node-wall-reverse",
  "node-weighted-1-reverse",
  "node-weighted-2-reverse",
  "node-weighted-3-reverse",
] as const;

export const appearFrom = (state: State) => {
  return appearMap.get(state) as AppearState;
};
const appearMap = new Map<State, AppearState>([
  ["node", "node"],
  ["node-start", "node-start"],
  ["node-end", "node-end"],
  ["node-visited", "node-visited"],
  ["node-shortest-path", "node-shortest-path"],
  ["node-wall", "node-wall"],
  ["node-weighted-1", "node-weighted-1"],
  ["node-weighted-2", "node-weighted-2"],
  ["node-weighted-3", "node-weighted-3"],
  ["node-visited-reverse", "node-visited"],
  ["node-shortest-path-reverse", "node-shortest-path"],
  ["node-wall-reverse", "node-wall"],
  ["node-weighted-1-reverse", "node-weighted-1"],
  ["node-weighted-2-reverse", "node-weighted-2"],
  ["node-weighted-3-reverse", "node-weighted-3"],
]);

export const disappearFrom = (state: State): State => {
  return disappearMap.get(state) as DisappearState;
};
const disappearMap = new Map<State, DisappearState>([
  ["node", "node"],
  ["node-start", "node-start"],
  ["node-end", "node-end"],
  ["node-visited", "node-visited-reverse"],
  ["node-shortest-path", "node-shortest-path-reverse"],
  ["node-wall", "node-wall-reverse"],
  ["node-weighted-1", "node-weighted-1-reverse"],
  ["node-weighted-2", "node-weighted-2-reverse"],
  ["node-weighted-3", "node-weighted-3-reverse"],
  ["node-visited-reverse", "node-visited-reverse"],
  ["node-shortest-path-reverse", "node-shortest-path-reverse"],
  ["node-wall-reverse", "node-wall-reverse"],
  ["node-weighted-1-reverse", "node-weighted-1-reverse"],
  ["node-weighted-2-reverse", "node-weighted-2-reverse"],
  ["node-weighted-3-reverse", "node-weighted-3-reverse"],
]);

export const toggleFrom = (state: State) => {
  return toggleMap.get(state) as State;
};
const toggleMap = new Map<State, State>([
  ["node", "node"],
  ["node-start", "node-start"],
  ["node-end", "node-end"],
  ["node-visited", "node-visited-reverse"],
  ["node-shortest-path", "node-shortest-path-reverse"],
  ["node-wall", "node-wall-reverse"],
  ["node-weighted-1", "node-weighted-1-reverse"],
  ["node-weighted-2", "node-weighted-2-reverse"],
  ["node-weighted-3", "node-weighted-3-reverse"],
  ["node-visited-reverse", "node-visited"],
  ["node-shortest-path-reverse", "node-shortest-path"],
  ["node-wall-reverse", "node-wall"],
  ["node-weighted-1-reverse", "node-weighted-1"],
  ["node-weighted-2-reverse", "node-weighted-2"],
  ["node-weighted-3-reverse", "node-weighted-3"],
]);
