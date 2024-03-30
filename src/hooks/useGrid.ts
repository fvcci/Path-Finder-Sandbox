import { useState, useEffect, useCallback } from "react";
import { NodeType } from "../components/NodeType";

// import local files
import { NODE_STATE } from "../constants";

const useGrid = (rows: number, cols: number) => {
  const start = useInitialPositionNode(rows, cols, 0.15, 0.2);
  const end = useInitialPositionNode(rows, cols, 0.5, 0.6);
  const [grid, setGrid] = useState<NodeType[][]>([]);

  // Create a new grid with grid[row][col] modified to value
  const setCell = useCallback(
    (node: NodeType) => {
      const newGrid = new Array(grid.length);
      for (let r = 0; r < grid.length; ++r) {
        newGrid[r] = [...grid[r]];
      }
      newGrid[node.row][node.col] = node;
      setGrid(newGrid);
    },
    [grid]
  );

  // Takes a list of states to clear from the grid
  const clearGridState = useCallback(
    (statesToClear: string[], draggedNode: NodeType): boolean => {
      let hasToggled = false;

      for (let r = 0; r < grid.length; ++r) {
        for (let c = 0; c < grid[r].length; ++c) {
          const { row, col } = initNodeFromDOM(r, c);
          const node = document.getElementById(`top-node-${row}-${col}`)!;

          for (const stateToClear of statesToClear) {
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
    setGrid(initGrid(rows, cols, start, end));
  }, [rows, cols, start, end]);

  return {
    start,
    end,
    grid,
    setGrid,
    setCell,
    setCellTopDOM,
    setCellDOM,
    clearGridState,
  };
};

export default useGrid;

const useInitialPositionNode = (
  rows: number,
  cols: number,
  initialRowPercent: number,
  initialColPercent: number
) => {
  const [node, setNode] = useState<NodeType>({
    row: Math.floor(rows * initialRowPercent),
    col: Math.floor(cols * initialColPercent),
    weight: 1,
    state: NODE_STATE.START,
  });

  useEffect(() => {
    if (node.row !== 0 && node.col !== 0) {
      return;
    }

    setNode({
      ...node,
      row: Math.floor(rows * initialRowPercent),
      col: Math.floor(cols * initialColPercent),
    });
  }, [node, rows, cols, initialRowPercent, initialColPercent]);

  return { node, setNode };
};

const initGrid = (
  rows: number,
  cols: number,
  start: ReturnType<typeof useInitialPositionNode>,
  end: ReturnType<typeof useInitialPositionNode>
) => {
  const grid = new Array<NodeType[]>(rows);
  for (let r = 0; r < grid.length; ++r) {
    grid[r] = new Array(cols);
    for (let c = 0; c < grid[r].length; ++c) {
      grid[r][c] = {
        row: r,
        col: c,
        weight: 1,
        state: "",
      };
    }
  }

  if (rows !== 0 && cols !== 0) {
    grid[start.node.row][start.node.col].state = NODE_STATE.START;
    grid[end.node.row][end.node.col].state = NODE_STATE.END;
  }

  return grid;
};

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
