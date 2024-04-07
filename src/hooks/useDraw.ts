// import local files
import * as Node from "../components/Node";
import { NODE_STATE, SPECIAL_STATES, BIG_RADIUS } from "../constants";

const useDraw = (
  setGrid: (grid: Node.Node[][]) => void,
  setCell: (node: Node.Node, pos: Node.Position) => void
) => {
  // Create a new grid with grid[row][col] toggled between a wall or none
  const toggleCellWall = (
    grid: Node.Node[][],
    pos: Node.Position,
    droppedObstruction: number
  ) => {
    const [weight, obstruction] =
      grid[pos.row][pos.col].state ===
      NODE_STATE.OBSTRUCTION[droppedObstruction]
        ? [1, NODE_STATE.OBSTRUCTION[droppedObstruction]]
        : [
            3 ** droppedObstruction,
            NODE_STATE.OBSTRUCTION_REVERSE[droppedObstruction],
          ];
    setCell(
      {
        weight,
        state: Node.toggleFrom(obstruction) as Node.State,
      },
      pos
    );
  };

  // Write a state around the given coords
  const writeState = (
    grid: Node.Node[][],
    pos: Node.Position,
    state: Node.State
  ) => {
    const newGrid = new Array(grid.length);
    for (let r = 0; r < grid.length; ++r) {
      const newGridRow = [...grid[r]];

      for (let c = 0; c < grid[r].length; ++c) {
        // Write a wall if the node is within the brush radius
        // and it's not a start or end node
        if (
          !SPECIAL_STATES.includes(grid[r][c].state) &&
          (pos.row - r) ** 2 + (pos.col - c) ** 2 <= BIG_RADIUS ** 2
        ) {
          const droppedObstruction = NODE_STATE.OBSTRUCTION.indexOf(state);
          newGridRow[c] = {
            ...grid[r][c],
            weight: droppedObstruction === -1 ? 1 : 3 ** droppedObstruction,
            state:
              state === "" && grid[r][c].state !== ""
                ? (Node.appearFrom(grid[r][c].state) as Node.State)
                : state,
          };
        }
      }

      newGrid[r] = newGridRow;
    }

    setGrid(newGrid);
  };

  const brush = (
    grid: Node.Node[][],
    pos: Node.Position,
    droppedObstruction: number
  ) => writeState(grid, pos, NODE_STATE.OBSTRUCTION[droppedObstruction]);

  const erase = (grid: Node.Node[][], pos: Node.Position) =>
    writeState(grid, pos, "");

  return { toggleCellWall, brush, erase };
};

export default useDraw;
