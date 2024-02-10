export const START_END_RATIO = {
  START: {
    ROW: 0.15,
    COL: 0.2,
  },
  END: {
    ROW: 0.5,
    COL: 0.6,
  },
};

export const SM = 640;

export const GRID_PADDING = {
  ROW: 15,
  COL: 10,
  ROW_SM: 5,
  COL_SM: 5,
};

export const NODE_SIZE = 23;

export const NODE_STATE = {
  DEFAULT: "node",
  START: "node-start",
  END: "node-end",
  VISITED: "node-visited",
  VISITED_REVERSE: "node-visited-reverse",
  SHORTEST_PATH: "node-shortest-path",
  SHORTEST_PATH_REVERSE: "node-shortest-path-reverse",
  WALL: "node-wall",
  WALL_REVERSE: "node-wall-reverse",
  OBSTRUCTION: [
    "node-wall",
    "node-weighted-1",
    "node-weighted-2",
    "node-weighted-3",
  ],
  OBSTRUCTION_REVERSE: [
    "node-wall-reverse",
    "node-weighted-1-reverse",
    "node-weighted-2-reverse",
    "node-weighted-3-reverse",
  ],
};

export const SPECIAL_STATES = [NODE_STATE.START, NODE_STATE.END];

export const DELTA = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];

export const ANIMATION_SPEED = {
  STEPS: 8,
  SHORTEST_PATH: 30,
};

export const BIG_RADIUS = 1;
