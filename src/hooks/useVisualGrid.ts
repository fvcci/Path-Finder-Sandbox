import { useState, useEffect } from "react";
import * as Node from "../components/Node";
import { executeAsynchronously } from "../util/async";

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

  const clearAnimation = async () => {
    await executeAsynchronously(
      Node.DISAPPEAR_ANIMATION_DURATION_MILLI_SECS,
      () => {
        const clearedGrid = gridForAnimation.map((row) =>
          row.map((node) => ({
            weight: node.weight,
            state: Node.disappear(node.state),
            animationDelay: 0,
          }))
        );
        setGridForAnimation(clearedGrid);
      }
    );
  };

  const clearAndSetGridForAnimation = async () => {
    if (gridForAnimation.some(row => ))
  };

  useEffect(() => {
    setGridState(initGrid(rows, cols, start, end));
    setGridForAnimation(initGrid(rows, cols, start, end));
  }, [rows, cols, start, end]);

  return {
    gridState,
    setGridState,
    gridForAnimation,
    clearAndSetGridForAnimation,
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
  return grid;
};

export type NodeForAnimation = Node.Node & { animationDelay: number };
