import { State } from "./components/Node";

export const NODE_STATE = {
  DEFAULT: "node" as State,
  START: "node-start" as State,
  END: "node-end" as State,
  VISITED: "node-visited" as State,
  VISITED_REVERSE: "node-visited-reverse" as State,
  SHORTEST_PATH: "node-shortest-path" as State,
  SHORTEST_PATH_REVERSE: "node-shortest-path-reverse" as State,
  WALL: "node-wall" as State,
  WALL_REVERSE: "node-wall-reverse" as State,
  OBSTRUCTION: [
    "node-wall" as State,
    "node-weighted-1" as State,
    "node-weighted-2" as State,
    "node-weighted-3" as State,
  ],
  OBSTRUCTION_REVERSE: [
    "node-wall-reverse" as State,
    "node-weighted-1-reverse" as State,
    "node-weighted-2-reverse" as State,
    "node-weighted-3-reverse" as State,
  ],
};
