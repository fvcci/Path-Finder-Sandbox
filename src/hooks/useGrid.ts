import { useState, useEffect } from "react";
import * as Node from "../components/Node";

export default function useGrid(
  rows: number,
  cols: number,
  start: Node.Position,
  end: Node.Position
) {
  const [grid, setGrid] = useState<Node.Node[][]>([]);

  useEffect(() => {
    setGrid(initGrid(rows, cols, start, end));
  }, [rows, cols, start, end]);

  return grid;
}

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
        state: "BASE",
      };
    }
  }

  if (rows !== 0 && cols !== 0) {
    grid[startNode.row][startNode.col].state = "START";
    grid[endNode.row][endNode.col].state = "END";
  }

  return grid;
};
