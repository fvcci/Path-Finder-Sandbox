import React, { useState, useEffect } from "react";
import * as Node from "../components/Node";
import { useToolBarContext } from "./useToolBarContext";
import { Observer, ObservableEvent } from "../util/observer";
import { assert } from "../util/asserts";

export default function useVisualGrid(
  rows: number,
  cols: number,
  start: Node.Position,
  end: Node.Position,
  stepsSpeedFactorMilliSecs: number,
  shortestPathSpeedFactorMilliSecs: number
): Observer & {
  gridState: Node.Node[][];
  setGridState: React.Dispatch<React.SetStateAction<Node.Node[][]>>;
  gridForAnimation: NodeForAnimation[][];
  setGridForAnimation: React.Dispatch<
    React.SetStateAction<NodeForAnimation[][]>
  >;
} {
  const [gridState, setGridState] = useState<Node.Node[][]>([]);
  const [gridForAnimation, setGridForAnimation] = useState<
    NodeForAnimation[][]
  >([]);
  const toolBar = useToolBarContext();

  useEffect(() => {
    setGridState(initGrid(rows, cols, start, end));
    setGridForAnimation(initGrid(rows, cols, start, end));
  }, [rows, cols, start, end]);

  const clearAnimation = async () => {
    let maxDisappearDuration = 0;
    gridForAnimation.forEach((row) => {
      row.forEach((node) => {
        maxDisappearDuration = Math.max(
          maxDisappearDuration,
          Node.STATE_ANIMATION_DURATIONS_MILLI_SECS[
            Node.disappearFrom(node.state)
          ]
        );
      });
    });

    if (maxDisappearDuration === 0) {
      return;
    }

    const clearedGrid = gridForAnimation.map((row) =>
      row.map((node) => ({
        weight: node.weight,
        state: Node.disappearFrom(node.state),
        animationDelay: 0,
      }))
    );

    await executeAsynchronously(maxDisappearDuration, () => {
      setGridForAnimation(clearedGrid);
    });
  };

  const runAlgorithmAnimation = async () => {
    if (gridState.length === 0) {
      return;
    }

    await clearAnimation();

    const { steps, shortestPath } = toolBar.selectedAlgorithm.run(
      gridState,
      start,
      end
    );

    const gridForAnimationCopy: NodeForAnimation[][] = gridForAnimation.map(
      (row) => row.map((node) => ({ ...node }))
    );

    steps.forEach((step, idx) => {
      assert(gridForAnimationCopy[step.row][step.col]);
      gridForAnimationCopy[step.row][step.col] = {
        ...gridForAnimationCopy[step.row][step.col],
        state: "VISITED",
        animationDelay: stepsSpeedFactorMilliSecs * idx,
      };
    });

    const stepsDuration =
      (steps.length - 1) * stepsSpeedFactorMilliSecs +
      Node.DISAPPEAR_ANIMATION_DURATION_MILLI_SECS;
    await executeAsynchronously(stepsDuration, () => {
      setGridForAnimation(gridForAnimationCopy);
    });

    shortestPath.forEach((shortestPathStep, idx) => {
      assert(gridForAnimationCopy[shortestPathStep.row][shortestPathStep.col]);
      gridForAnimationCopy[shortestPathStep.row][shortestPathStep.col] = {
        ...gridForAnimationCopy[shortestPathStep.row][shortestPathStep.col],
        state: "SHORTEST_PATH",
        animationDelay: shortestPathSpeedFactorMilliSecs * idx,
      };
    });

    const shortestPathDuration =
      (shortestPath.length - 1) * shortestPathSpeedFactorMilliSecs;
    await executeAsynchronously(shortestPathDuration, () => {
      setGridForAnimation(gridForAnimationCopy);
    });

    toolBar.runButton.notifyObservers("ALGORITHM FINISHED RUNNING");
  };

  return {
    update: (event: ObservableEvent) => {
      switch (event) {
        case "RUN ALGORITHM":
          runAlgorithmAnimation();
          break;
        case "ABORT ALGORITHM":
          clearAnimation();
          break;
      }
    },
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
  return grid;
};

export type NodeForAnimation = Node.Node & { animationDelay: number };

// const AsyncExecuter = () => {
//   const promises: Promise<void>[] = [];

//   return {
//     executeAsynchronously: async (
//       executionTimeMilliSecs: number,
//       f: () => void
//     ) => {
//       return new Promise<void>((resolve) => {
//         f();
//         setTimeout(resolve, executionTimeMilliSecs);
//       });
//     },
//   };
// };

const executeAsynchronously = async (
  executionTimeMilliSecs: number,
  f: () => void
) =>
  new Promise((resolve) => {
    f();
    setTimeout(resolve, executionTimeMilliSecs);
  });
