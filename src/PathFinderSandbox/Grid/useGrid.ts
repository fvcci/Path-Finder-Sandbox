import React, { useState, useEffect, useCallback } from "react";
import { NodeType } from "../Node";

// import local files
import { START_END_RATIO, NODE_STATE } from "../../constants";

interface useGridType {
  grid: NodeType[][];
  setGrid: React.Dispatch<React.SetStateAction<NodeType[][]>>;
  setCell: (node: NodeType) => void;
  setCellTopDOM: (node: NodeType) => void;
  setCellDOM: (node: NodeType) => void;
  clearGridState: (statesToClear: string[], draggedNode: NodeType) => boolean;
}

const useGrid = (rows: number, cols: number): useGridType => {
  const [grid, setGrid] = useState<NodeType[][]>([]);

  const initNode = useCallback(
    (
      row: number,
      col: number,
      start: { row: number; col: number },
      end: { row: number; col: number }
    ): NodeType => {
      let state = "";
      if (row === start.row && col === start.col) {
        state = NODE_STATE.START;
      } else if (row === end.row && col === end.col) {
        state = NODE_STATE.END;
      }

      return {
        row,
        col,
        weight: 1,
        state,
      };
    },
    []
  );

  const initNodeFromDOM = (row: number, col: number): NodeType => {
    let state = "";
    const node = document
      .getElementById(`node-${row}-${col}`)
      ?.className.substring(NODE_STATE.DEFAULT.length + 1);
    if (node === NODE_STATE.START || node === NODE_STATE.END) {
      state = node;
    }
    return {
      row,
      col,
      weight: 1,
      state,
    };
  };

  const initGrid = useCallback(() => {
    const start = {
      row: Math.floor(rows * START_END_RATIO.START.ROW),
      col: Math.floor(cols * START_END_RATIO.START.COL),
    };
    const end = {
      row: Math.floor(rows * START_END_RATIO.END.ROW),
      col: Math.floor(cols * START_END_RATIO.END.COL),
    };

    let grid = new Array(rows);
    for (let r = 0; r < grid.length; ++r) {
      grid[r] = new Array(cols);
      for (let c = 0; c < grid[r].length; ++c) {
        grid[r][c] = initNode(r, c, start, end);
      }
    }
    return grid;
  }, [rows, cols]);

  // Create a new grid with grid[row][col] modified to value
  const setCell = useCallback(
    (node: NodeType) => {
      let newGrid = new Array(grid.length);
      for (let r = 0; r < grid.length; ++r) {
        newGrid[r] = [...grid[r]];
      }
      newGrid[node.row][node.col] = node;
      setGrid(newGrid);
    },
    [grid]
  );

  const setCellTopDOM = (node: NodeType) => {
    document.getElementById(
      `top-node-${node.row}-${node.col}`
    )!.className = `top ${NODE_STATE.DEFAULT} ${node.state}`;
  };

  const setCellDOM = (node: NodeType) => {
    document.getElementById(
      `node-${node.row}-${node.col}`
    )!.className = `${NODE_STATE.DEFAULT} ${node.state}`;
  };

  // Takes a list of states to clear from the grid
  const clearGridState = useCallback(
    (statesToClear: string[], draggedNode: NodeType): boolean => {
      let hasToggled = false;

      for (let r = 0; r < grid.length; ++r) {
        for (let c = 0; c < grid[r].length; ++c) {
          const { row, col } = initNodeFromDOM(r, c);
          const node = document.getElementById(`top-node-${row}-${col}`)!;

          for (let stateToClear of statesToClear) {
            // Toggle the current node's state to its reverse animation unless
            // it is the dragged node then don't.
            if (
              node.className.split(" ").includes(stateToClear) &&
              (!draggedNode ||
                draggedNode.row !== row ||
                draggedNode.col !== col)
            ) {
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
    setGrid(initGrid());
  }, [initGrid]);

  return { grid, setGrid, setCell, setCellTopDOM, setCellDOM, clearGridState };
};

export default useGrid;
