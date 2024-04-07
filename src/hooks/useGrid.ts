import { useState, useEffect, useCallback } from "react";
import * as Node from "../components/Node";

// import local files
import { NODE_STATE } from "../constants";

const useGrid = (rows: number, cols: number) => {
  const start = useInitialPosition(rows, cols, 0.15, 0.2);
  const end = useInitialPosition(rows, cols, 0.5, 0.6);
  const [grid, setGrid] = useState<Node.Node[][]>([]);

  // Create a new grid with grid[row][col] modified to value
  const setCell = useCallback(
    (node: Node.Node, pos: Node.Position) => {
      const newGrid = new Array(grid.length);
      for (let r = 0; r < grid.length; ++r) {
        newGrid[r] = [...grid[r]];
      }
      newGrid[pos.row][pos.col] = node;
      setGrid(newGrid);
    },
    [grid]
  );

  // Takes a list of states to clear from the grid
  const clearGridState = useCallback(
    (statesToClear: string[]): boolean => {
      let hasToggled = false;

      for (let r = 0; r < grid.length; ++r) {
        for (let c = 0; c < grid[r].length; ++c) {
          const node = document.getElementById(`top-node-${r}-${c}`)!;

          for (const stateToClear of statesToClear) {
            // Toggle the current node's state to its reverse animation unless
            // it is the dragged node then don't.
            if (node.className.split(" ").includes(stateToClear)) {
              node.className = node.className + "-reverse";
              hasToggled = true;
            }
          }
        }
      }

      return hasToggled;
    },
    [grid]
  );

  useEffect(() => {
    setGrid(initGrid(rows, cols, start.position, end.position));
  }, [rows, cols, start.position, end.position]);

  return {
    start,
    end,
    grid,
    setGrid,
    setCell,
    setCellTopDOM,
    clearGridState,
  };
};

export default useGrid;

const useInitialPosition = (
  rows: number,
  cols: number,
  initialRowPercent: number,
  initialColPercent: number
) => {
  const [pos, setPosition] = useState<Node.Position>({
    row: Math.floor(rows * initialRowPercent),
    col: Math.floor(cols * initialColPercent),
  });

  useEffect(() => {
    if (pos.row !== 0 && pos.col !== 0) {
      return;
    }

    setPosition({
      row: Math.floor(rows * initialRowPercent),
      col: Math.floor(cols * initialColPercent),
    });
  }, [pos, rows, cols, initialRowPercent, initialColPercent]);

  return { position: pos, setPosition };
};

const initGrid = (
  rows: number,
  cols: number,
  startNode: Node.Position,
  endNode: Node.Position
) => {
  const grid = new Array<Node.Node[]>(rows);
  for (let r = 0; r < grid.length; ++r) {
    grid[r] = new Array(cols);
    for (let c = 0; c < grid[r].length; ++c) {
      grid[r][c] = {
        weight: 1,
        state: "",
      };
    }
  }

  if (rows !== 0 && cols !== 0) {
    grid[startNode.row][startNode.col].state = NODE_STATE.START;
    grid[endNode.row][endNode.col].state = NODE_STATE.END;
  }

  return grid;
};

const setCellTopDOM = (node: Node.Node, position: Node.Position) => {
  document.getElementById(
    `top-node-${position.row}-${position.col}`
  )!.className = `top ${NODE_STATE.DEFAULT} ${node.state}`;
};
