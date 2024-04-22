import React, { useState, useEffect } from "react";
import * as Node from "../components/Node";
import { useToolBarContext } from "./useToolBarContext";
import { Observer, ObservableEvent } from "../util/observer";
import { assert } from "../util/asserts";
import { DELTA, inBounds } from "../algorithms/Algorithm";

interface VisualGrid extends Observer {
  gridState: Node.Node[][];
  setGridState: React.Dispatch<React.SetStateAction<Node.Node[][]>>;
  gridForAnimation: NodeForAnimation[][];
  setGridForAnimation: React.Dispatch<
    React.SetStateAction<NodeForAnimation[][]>
  >;
}

export default function useVisualGrid(
  rows: number,
  cols: number,
  start: Node.Position,
  end: Node.Position,
  traversalPathSpeedFactorMilliSecs: number,
  shortestPathSpeedFactorMilliSecs: number
): VisualGrid {
  const [gridState, setGridState] = useState<Node.Node[][]>([]);
  const [gridForAnimation, setGridForAnimation] = useState<
    NodeForAnimation[][]
  >([]);
  const [asyncAnimator] = useState(AsyncAnimator());
  const toolBar = useToolBarContext();

  useEffect(() => {
    setGridState(initGrid(rows, cols, start, end));
    setGridForAnimation(initGrid(rows, cols, start, end));
  }, [rows, cols, start, end]);

  const clearAnimation = () => {
    const clearedGrid = gridForAnimation.map((row) =>
      row.map((node) => ({
        weight: node.weight,
        state: Node.disappearFrom(node.state),
        animationDelay: 0,
      }))
    );

    setGridForAnimation(clearedGrid);
  };

  const runPathFindingAnimation = () => {
    const gridsAreEmpty = [gridState, gridForAnimation].every(
      (grid) => grid.length === 0
    );
    const loadedStartAndEndNode = [gridState, gridForAnimation].every(
      (grid) =>
        inBounds(grid, start) &&
        inBounds(grid, end) &&
        grid[start.row][start.col].state === "START" &&
        grid[end.row][end.col].state === "END"
    );

    if (gridsAreEmpty || !loadedStartAndEndNode) {
      return;
    }

    const { traversalPath, shortestPath } = toolBar.selectedAlgorithm.run(
      gridState,
      start,
      end
    );

    if (traversalPath.length === 0) {
      assert(shortestPath.length === 0);
      toolBar.runButton.notifyObservers("ALGORITHM_FINISHED_RUNNING");
      return;
    }

    assert(
      [traversalPath, shortestPath].every((path) =>
        path.every(
          ({ row, col }) =>
            !(row === start.row && col === start.col) &&
            !(row === end.row && col === end.col)
        )
      ),
      "paths should not include the start and end node"
    );

    const traversalPathAnimatedGrid = animateGridPathFinding(
      gridForAnimation,
      traversalPath,
      "VISITED",
      traversalPathSpeedFactorMilliSecs
    );

    const shortestPathAnimatedGrid = animateGridPathFinding(
      traversalPathAnimatedGrid,
      shortestPath,
      "SHORTEST_PATH",
      shortestPathSpeedFactorMilliSecs
    );

    if (isDisplayingAlgorithm(gridForAnimation, start)) {
      asyncAnimator.animate(
        Node.DISAPPEAR_ANIMATION_DURATION_MILLI_SECS,
        "ANIMATE_CLEAR_GRID",
        clearAnimation
      );
    }

    const traversalPathDuration =
      (traversalPath.length - 1) * traversalPathSpeedFactorMilliSecs +
      Node.APPEAR_ANIMATION_DURATION_MILLI_SECS;
    asyncAnimator.animate(traversalPathDuration, "ANIMATE_TRAVERSAL", () => {
      setGridForAnimation(traversalPathAnimatedGrid);
    });

    const shortestPathDuration =
      (shortestPath.length - 1) * shortestPathSpeedFactorMilliSecs +
      Node.APPEAR_ANIMATION_DURATION_MILLI_SECS;
    asyncAnimator.animate(shortestPathDuration, "ANIMATE_SHORTEST_PATH", () => {
      setGridForAnimation(shortestPathAnimatedGrid);
    });

    asyncAnimator.animate(0, "ANIMATE_END", () => {
      toolBar.runButton.notifyObservers("ALGORITHM_FINISHED_RUNNING");
    });
  };

  return {
    update: (event: ObservableEvent) => {
      switch (event) {
        case "RUN_ALGORITHM":
          runPathFindingAnimation();
          break;
        case "ABORT_ALGORITHM":
          asyncAnimator.stopAnimations();
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
    .fill(null)
    .map(() =>
      new Array(cols)
        .fill(null)
        .map(() => ({ weight: 1, state: "BASE", animationDelay: 0 }))
    );

  if (rows !== 0 && cols !== 0) {
    grid[startNode.row][startNode.col].state = "START";
    grid[endNode.row][endNode.col].state = "END";
  }
  return grid;
};

const isDisplayingAlgorithm = (grid: Node.Node[][], start: Node.Position) => {
  return DELTA.some((delta) => {
    const [r, c] = [start.row + delta[0], start.col + delta[1]];
    if (!inBounds(grid, { row: r, col: c })) {
      return false;
    }

    const hasTraversalState = (
      ["VISITED", "SHORTEST_PATH"] as Node.State[]
    ).includes(grid[r][c].state);
    return hasTraversalState;
  });
};

const animateGridPathFinding = (
  gridOg: NodeForAnimation[][],
  traversalPath: Node.Position[],
  state: Node.State,
  incrementalSpeedFactorMilliSecs: number
) => {
  const grid = gridOg.map((row) => row.map((node) => ({ ...node })));
  traversalPath.forEach((node, idx) => {
    assert(grid[node.row][node.col]);
    grid[node.row][node.col] = {
      ...grid[node.row][node.col],
      state: state,
      animationDelay: incrementalSpeedFactorMilliSecs * idx,
    };
  });

  return grid;
};

export interface NodeForAnimation extends Node.Node {
  animationDelay: number;
}

const AsyncAnimator = () => {
  const animationProcessIDMap = new Map<AnimationID, number>([]);
  let totalAnimationTimeMilliSecs = 0;

  return {
    stopAnimations: () => {
      animationProcessIDMap.forEach((processID) => clearTimeout(processID));
      animationProcessIDMap.clear();
      totalAnimationTimeMilliSecs = 0;
    },
    animate: (
      animationTimeMilliSecs: number,
      animationID: AnimationID,
      f: () => void
    ) => {
      if (animationProcessIDMap.has(animationID)) {
        return;
      }

      const processID = setTimeout(() => {
        f();
        animationProcessIDMap.delete(animationID);
        totalAnimationTimeMilliSecs -= animationTimeMilliSecs;
      }, totalAnimationTimeMilliSecs);

      animationProcessIDMap.set(animationID, processID);

      totalAnimationTimeMilliSecs += animationTimeMilliSecs;
    },
  };
};

type AnimationID =
  | "ANIMATE_TRAVERSAL"
  | "ANIMATE_SHORTEST_PATH"
  | "ANIMATE_CLEAR_GRID"
  | "ANIMATE_END";
