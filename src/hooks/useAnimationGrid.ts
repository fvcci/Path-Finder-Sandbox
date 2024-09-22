import { useState, useEffect } from "react";
import * as Node from "../lib/Node";
import useDimensionsContext from "./useDimensionContext";
import { Dimensions } from "../context/DimensionContext";

export type AnimationGrid = ReturnType<typeof useAnimationGrid>;

export default function useAnimationGrid(
  startRatio: Dimensions,
  endRatio: Dimensions
) {
  const [gridState, setGridState] = useState<Node.Node<Node.State>[][] | null>(
    null
  );
  const [gridForAnimation, setGridForAnimation] = useState<
    NodeForAnimation[][] | null
  >(null);

  const dimensions = useDimensionsContext();

  useEffect(() => {
    if (!dimensions.dimensions) {
      return;
    }
    setGrids(
      initGridForAnimation(
        dimensions.dimensions,
        // startRatio and endRatio are new objects every few seconds (even though they're
        // constants) so have to destructure them into their enumerables
        { rows: startRatio.rows, cols: startRatio.cols },
        { rows: endRatio.rows, cols: endRatio.cols }
      )
    );
  }, [
    dimensions.dimensions,
    startRatio.rows,
    startRatio.cols,
    endRatio.rows,
    endRatio.cols,
  ]);

  const setGrids = (grid: NodeForAnimation[][]) => {
    setGridForAnimation(grid);
    setGridState(mapGridForAnimationToGridState(grid));
  };

  return {
    gridForAnimation,
    setGridForAnimation,
    gridState,
    setGrids,
  };
}

const initGridForAnimation = (
  dimensions: Dimensions,
  startRatio: Dimensions,
  endRatio: Dimensions
) => {
  const grid: NodeForAnimation[][] = new Array(dimensions.rows)
    .fill(null)
    .map(() =>
      new Array(dimensions.cols)
        .fill(null)
        .map(() => ({ weight: 1, state: "BASE", animationDelay: 0 }))
    );

  const start = multiply(dimensions, startRatio);
  const end = multiply(dimensions, endRatio);

  grid[start.row][start.col].state = "START";
  grid[end.row][end.col].state = "END";
  return grid;
};

const multiply = (x: Dimensions, y: Dimensions): Node.Position => ({
  row: Math.floor(x.rows * y.rows),
  col: Math.floor(x.cols * y.cols),
});

const mapGridForAnimationToGridState = (
  gridForAnimation: NodeForAnimation[][]
): Node.Node<Node.State>[][] =>
  gridForAnimation.map((row) =>
    row.map((node) => ({
      weight: node.weight,
      state: Node.convertAnimationToBaseState(node.state),
    }))
  );

export interface NodeForAnimation extends Node.Node<Node.State> {
  animationDelay: number;
}
