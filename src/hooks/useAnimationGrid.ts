import React, { useState, useEffect } from "react";
import * as Node from "../components/Node";
import { useToolBarContext } from "./useToolBarContext";
import { Observer, ObservableEvent } from "../util/observer";
import { assert } from "../util/asserts";
import { DELTA, inBounds } from "../algorithms/Algorithm";
import { AsyncAnimator } from "../util/AsyncAnimator";

interface AnimationGrid extends Observer {
  getGridForAnimation: () => NodeForAnimation[][];
  setGridForAnimation: React.Dispatch<
    React.SetStateAction<NodeForAnimation[][]>
  >;
  getGridState: () => Node.Node<Node.State>[][];
  setGrids: (grid: NodeForAnimation[][]) => void;
}

export default function useAnimationGrid(
  dimensions: Dimensions,
  start: Node.Position | null,
  end: Node.Position | null,
  traversalPathSpeedFactorMilliSecs: number,
  shortestPathSpeedFactorMilliSecs: number
): AnimationGrid {
  const [gridState, setGridState] = useState<Node.Node<Node.State>[][]>([]);
  const [gridForAnimation, setGridForAnimation] = useState<
    NodeForAnimation[][]
  >([]);
  const [asyncAnimator] = useState(AsyncAnimator());

  const toolBar = useToolBarContext();

  useEffect(() => {
    console.log(dimensions.rows, dimensions.cols, start, end);
    if (dimensions.rows && dimensions.cols && start && end) {
      setGrids(initGridForAnimation(dimensions, start, end));
    }
  }, [dimensions, start, end]);

  const setGrids = (grid: NodeForAnimation[][]) => {
    setGridForAnimation(grid);
    setGridState(mapGridForAnimationToGridState(grid));
  };

  const runPathFindingAnimation = () => {
    assert(start && end, "start and end nodes must be defined");

    const loadedStartAndEndNodeIntoGrid = [gridState, gridForAnimation].every(
      (grid) =>
        inBounds(grid, start) &&
        inBounds(grid, end) &&
        grid[start.row][start.col].state === "START" &&
        grid[end.row][end.col].state === "END"
    );
    assert(
      loadedStartAndEndNodeIntoGrid,
      "Start and end nodes weren't loaded into the grid"
    );

    const { visitedPath, shortestPath } = toolBar.selectedAlgorithm.run(
      gridState,
      start,
      end
    );

    if (visitedPath.length === 0) {
      assert(shortestPath.length === 0);
      console.log(
        "ALGORITHM_FINISHED_RUNNING runPathFindingAnimation, visitedPath.length === 0"
      );
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
        Node.VANISH_ANIMATION_DURATION_MILLI_SECS,
        () => setGridForAnimation(buildAnimationVanishedPath(gridForAnimation))
      );
    }

    const traversalPathAnimatedGrid = buildAnimationPath(
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

    const shortestPathAnimatedGrid = buildAnimationPath(
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

    asyncAnimator.animate(() => {
      console.log(
        "ALGORITHM_FINISHED_RUNNING runPathFindingAnimation, AsyncAnimator"
      );
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
          setGridForAnimation(buildAnimationVanishedPath(gridForAnimation));
          break;
      }
    },
    getGridForAnimation: () => gridForAnimation,
    setGridForAnimation,
    getGridState: () => gridState,
    setGrids,
  };
}

const initGridForAnimation = (
  dimensions: Dimensions,
  startNode: Node.Position,
  endNode: Node.Position
) => {
  const grid: NodeForAnimation[][] = new Array(dimensions.rows)
    .fill(null)
    .map(() =>
      new Array(dimensions.cols)
        .fill(null)
        .map(() => ({ weight: 1, state: "BASE", animationDelay: 0 }))
    );

  grid[startNode.row][startNode.col].state = "START";
  grid[endNode.row][endNode.col].state = "END";
  return grid;
};

const buildAnimationVanishedPath = (gridForAnimation: NodeForAnimation[][]) =>
  gridForAnimation.map((row) =>
    row.map((node) => ({
      weight: 1,
      state: Node.vanishPathFrom(node.state),
      animationDelay: 0,
    }))
  );

const buildAnimationPath = (
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

const mapGridForAnimationToGridState = (
  gridForAnimation: NodeForAnimation[][]
): Node.Node<Node.State>[][] =>
  gridForAnimation.map((row) =>
    row.map((node) => {
      return {
        weight: node.weight,
        state: Node.convertVanishToBaseState(node.state),
      };
    })
  );

export interface NodeForAnimation extends Node.Node<Node.State> {
  animationDelay: number;
}

export const isDisplayingAlgorithm = (
  grid: NodeForAnimation[][],
  start: Node.Position | null
) => {
  return (
    start &&
    DELTA.some((delta) => {
      const [r, c] = [start.row + delta[0], start.col + delta[1]];
      if (!inBounds(grid, { row: r, col: c })) {
        return false;
      }

      const hasTraversalState = (
        ["VISITED", "SHORTEST_PATH"] as Node.State[]
      ).includes(grid[r][c].state);
      return hasTraversalState;
    })
  );
};

export type Dimensions = {
  rows: number | null;
  cols: number | null;
};
