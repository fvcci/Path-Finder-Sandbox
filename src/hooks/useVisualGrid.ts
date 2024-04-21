import { useState, useEffect } from "react";
import * as Node from "../components/Node";

export default function useVisualGrid(
  rows: number,
  cols: number,
  start: Node.Position,
  end: Node.Position
) {
  const [gridState, setGridState] = useState<Node.Node[][]>([]);
  const [gridForAnimation, setGridForAnimation] = useState<
    NodeForAnimation[][]
  >([]);

  useEffect(() => {
    setGridState(initGrid(rows, cols, start, end));
    setGridForAnimation(initGrid(rows, cols, start, end));
  }, [rows, cols, start, end]);

  return {
    gridState,
    setGridState,
    gridForAnimation,
    setGridForAnimation,
  };
}

const initGrid = (
  rows: number,
  cols: number,
  startNode: Node.Position,
  endNode: Node.Position
) => {
  const grid: NodeForAnimation[][] = new Array(rows)
    .fill(undefined)
    .map(() =>
      new Array(cols)
        .fill(undefined)
        .map(() => ({ weight: 1, state: "BASE", animationDelay: 0 }))
    );

  if (rows !== 0 && cols !== 0) {
    grid[startNode.row][startNode.col].state = "START";
    grid[endNode.row][endNode.col].state = "END";
  }

  console.log(grid);
  return grid;
};

export type NodeForAnimation = Node.Node & { animationDelay: number };
