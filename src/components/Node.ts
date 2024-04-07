export interface Node {
  weight: number;
  state: State;
}

export interface Position {
  row: number;
  col: number;
}

export type State = AppearState | DisappearState;

type AppearState = (typeof APPEAR_STATES)[number];
const APPEAR_STATES = [
  "",
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
  "",
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

export const appearFrom = (className: string) => {
  return applyForEachClass(className, (x) =>
    appearMap.has(x) ? (appearMap.get(x as AppearState) as AppearState) : x
  );
};
const appearMap = new Map<string, AppearState>([
  ["node-visited-reverse", "node-visited"],
  ["node-shortest-path-reverse", "node-shortest-path"],
  ["node-wall-reverse", "node-wall"],
  ["node-weighted-1-reverse", "node-weighted-1"],
  ["node-weighted-2-reverse", "node-weighted-2"],
  ["node-weighted-3-reverse", "node-weighted-3"],
] as [State, AppearState][]);

// export const disappearFrom = (className: string) => {
//   return applyForEachClass(className, (x) =>
//     disappearMap.has(x)
//       ? (toggleMap.get(x as DisappearState) as DisappearState)
//       : x
//   );
// };
// const disappearMap = new Map<string, DisappearState>([
//   ["node-visited", "node-visited-reverse"],
//   ["node-shortest-path", "node-shortest-path-reverse"],
//   ["node-wall", "node-wall-reverse"],
//   ["node-weighted-1", "node-weighted-1-reverse"],
//   ["node-weighted-2", "node-weighted-2-reverse"],
//   ["node-weighted-3", "node-weighted-3-reverse"],
// ] as [State, DisappearState][]);

export const toggleFrom = (className: string) => {
  return applyForEachClass(className, (x) =>
    toggleMap.has(x) ? (toggleMap.get(x as State) as State) : x
  );
};
const toggleMap = new Map<string, State>([
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
] as [State, State][]);

export const applyForEachClass = (
  className: string,
  f: (x: string) => string
) => className.split(" ").map(f).join(" ");
