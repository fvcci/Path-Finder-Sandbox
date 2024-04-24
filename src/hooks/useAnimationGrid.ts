import React, { useState, useEffect } from "react";
import * as Node from "../components/Node";
import { useToolBarContext } from "./useToolBarContext";
import { Observer, ObservableEvent } from "../util/observer";
import { assert } from "../util/asserts";
import { DELTA, inBounds } from "../algorithms/Algorithm";
import { AsyncAnimator } from "../util/AsyncAnimator";

interface AnimationGrid extends Observer {
  gridState: Node.Node[][];
  setGridState: React.Dispatch<React.SetStateAction<Node.Node[][]>>;
  gridForAnimation: NodeForAnimation[][];
  setGridForAnimation: React.Dispatch<
    React.SetStateAction<NodeForAnimation[][]>
  >;
}

export default function useAnimationGrid(
  rows: number,
  cols: number,
  start: Node.Position,
  end: Node.Position,
  traversalPathSpeedFactorMilliSecs: number,
  shortestPathSpeedFactorMilliSecs: number
): AnimationGrid {
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

    const { visitedPath, shortestPath } = toolBar.selectedAlgorithm.run(
      gridState,
      start,
      end
    );

    if (visitedPath.length === 0) {
      assert(shortestPath.length === 0);
      toolBar.runButton.notifyObservers("ALGORITHM_FINISHED_RUNNING");
      return;
    }

    assert(
      [visitedPath, shortestPath].every((path) =>
        path.every(
          ({ row, col }) =>
            !(row === start.row && col === start.col) &&
            !(row === end.row && col === end.col)
        )
      ),
      "paths should not include the start and end node"
    );

    if (isDisplayingAlgorithm(gridForAnimation, start)) {
      asyncAnimator.queueAnimation(
        "ANIMATE_CLEAR_GRID",
        Node.DISAPPEAR_ANIMATION_DURATION_MILLI_SECS,
        () =>
          setGridForAnimation(buildClearedGridForAnimation(gridForAnimation))
      );
    }

    const traversalPathAnimatedGrid = buildPathOnGridForAnimation(
      gridForAnimation,
      visitedPath,
      "VISITED_PATH",
      traversalPathSpeedFactorMilliSecs
    );
    const visitedPathDuration =
      (visitedPath.length - 2) * traversalPathSpeedFactorMilliSecs +
      Node.APPEAR_ANIMATION_DURATION_MILLI_SECS;

    asyncAnimator.queueAnimation(
      "ANIMATE_VISITED_PATH",
      visitedPathDuration,
      () => setGridForAnimation(traversalPathAnimatedGrid)
    );

    const shortestPathAnimatedGrid = buildPathOnGridForAnimation(
      traversalPathAnimatedGrid,
      shortestPath,
      "SHORTEST_PATH",
      shortestPathSpeedFactorMilliSecs
    );
    const shortestPathDuration =
      (shortestPath.length - 2) * shortestPathSpeedFactorMilliSecs +
      Node.APPEAR_ANIMATION_DURATION_MILLI_SECS;

    asyncAnimator.queueAnimation(
      "ANIMATE_SHORTEST_PATH",
      shortestPathDuration,
      () => setGridForAnimation(shortestPathAnimatedGrid)
    );

    asyncAnimator.animate(() =>
      toolBar.runButton.notifyObservers("ALGORITHM_FINISHED_RUNNING")
    );
  };

  return {
    update: (event: ObservableEvent) => {
      switch (event) {
        case "RUN_ALGORITHM":
          runPathFindingAnimation();
          break;
        case "ABORT_ALGORITHM":
          asyncAnimator.stopAnimations();
          setGridForAnimation(buildClearedGridForAnimation(gridForAnimation));
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

const buildClearedGridForAnimation = (gridForAnimation: NodeForAnimation[][]) =>
  gridForAnimation.map((row) =>
    row.map((node) => ({
      weight: node.weight,
      state: Node.disappearPathFrom(node.state),
      animationDelay: 0,
    }))
  );

const buildPathOnGridForAnimation = (
  gridOg: NodeForAnimation[][],
  path: Node.Position[],
  state: Node.State,
  incrementalSpeedFactorMilliSecs: number
) => {
  const grid = gridOg.map((row) => row.map((node) => ({ ...node })));
  path.forEach((node, idx) => {
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
