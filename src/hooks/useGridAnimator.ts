import { useState } from "react";
import { AsyncAnimator } from "../util/AsyncAnimator";
import useToolBarContext from "./useToolBarContext";
import { assert } from "../util/asserts";
import * as Node from "../components/Node";
import useAnimationGrid, {
  Dimensions,
  NodeForAnimation,
} from "./useAnimationGrid";
import { ObservableEvent, Observer } from "../util/observer";
import { inBounds } from "../algorithms/Algorithm";

export default function useGridAnimator(
  start: Dimensions,
  end: Dimensions,
  traversalPathSpeedFactorMilliSecs: number,
  shortestPathSpeedFactorMilliSecs: number
) {
  const animationGrid = useAnimationGrid(start, end);
  const [asyncAnimator] = useState(AsyncAnimator());
  const toolBar = useToolBarContext();

  const asyncClearGrid = () => {
    asyncAnimator.queueAnimation(
      "ANIMATE_VANISH_GRID",
      Node.VANISH_ANIMATION_DURATION_MILLI_SECS,
      () =>
        animationGrid.setGridForAnimation(
          buildAnimationVanishedPath(animationGrid.gridForAnimation!)
        )
    );
    asyncAnimator.queueAnimation("ANIMATE_CLEAR_GRID", 0, () =>
      animationGrid.setGridForAnimation(
        buildClearedGrid(animationGrid.gridForAnimation!)
      )
    );
  };

  const runPathFindingAnimation = () => {
    assert(
      animationGrid.gridState && animationGrid.gridForAnimation,
      "grid not fully initialized"
    );

    const { visitedPath, shortestPath } = toolBar.selectedAlgorithm.run(
      animationGrid.gridState
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
            inBounds(animationGrid.gridForAnimation, { row, col }) &&
            !Node.isDestination(animationGrid.gridForAnimation![row][col].state)
        )
      ),
      "paths should not include destinations"
    );

    if (isDisplayingAlgorithm(animationGrid.gridForAnimation)) {
      asyncClearGrid();
    }

    const traversalPathAnimatedGrid = buildAnimationPath(
      animationGrid.gridForAnimation,
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
      () => animationGrid.setGridForAnimation(traversalPathAnimatedGrid)
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
      () => animationGrid.setGridForAnimation(shortestPathAnimatedGrid)
    );

    asyncAnimator.animate(() => {
      toolBar.runButton.notifyObservers("ALGORITHM_FINISHED_RUNNING");
    });
  };

  return {
    observer: {
      update: (event: ObservableEvent) => {
        assert(
          animationGrid.gridState && animationGrid.gridForAnimation,
          "grid not fully initialized"
        );

        switch (event) {
          case "RUN_ALGORITHM":
            runPathFindingAnimation();
            break;
          case "ABORT_ALGORITHM":
            asyncAnimator.stopAnimations();
            asyncClearGrid();
            asyncAnimator.animate();
            break;
        }
      },
    } as Observer,
    animationGrid,
  };
}

const buildAnimationVanishedPath = (grid: NodeForAnimation[][]) =>
  grid.map((row) =>
    row.map((node) =>
      Node.isPath(node.state)
        ? {
            ...node,
            state: Node.vanishPathFrom(node.state),
            animationDelay: 0,
          }
        : node
    )
  );

const buildClearedGrid = (grid: NodeForAnimation[][]) =>
  grid.map((row) =>
    row.map((node) =>
      Node.isPath(node.state)
        ? {
            ...node,
            state: Node.convertAnimationToBaseState(node.state),
            animationDelay: 0,
          }
        : node
    )
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

export const isDisplayingAlgorithm = (grid: NodeForAnimation[][] | null) =>
  grid && grid.some((row) => row.some((node) => Node.isPath(node.state)));
