import useAsyncAnimator from "./useAsyncAnimator";
import useToolBarContext from "./useToolBarContext";
import assert from "../lib/assert";
import * as Node from "../lib/Node";
import { AnimationGrid, NodeForAnimation } from "./useAnimationGrid";
import { ObservableEvent, Observer } from "./useObserver";

export default function useGridAnimator(
  animationGrid: AnimationGrid,
  traversalPathSpeedFactorMilliSecs: number,
  shortestPathSpeedFactorMilliSecs: number
): Observer {
  const asyncAnimator = useAsyncAnimator();
  const toolBar = useToolBarContext();

  const runPathFindingAnimation = () => {
    assert(
      animationGrid.gridState && animationGrid.gridForAnimation,
      "grid not fully initialized"
    );

    const { visitedPath, shortestPath } = toolBar.selectedAlgorithm.run(
      animationGrid.gridState
    );
    Node.assertValidPaths(animationGrid.gridState, visitedPath);
    Node.assertValidPaths(animationGrid.gridState, shortestPath);

    if (visitedPath.length === 0) {
      assert(shortestPath.length === 0);
      toolBar.runButton.notifyObservers("ALGORITHM_FINISHED_RUNNING");
      return;
    }

    // Used because react asynchronously updates state
    let gridForAnimationSyncronous = animationGrid.gridForAnimation;
    if (toolBar.runButton.isDisplayingAlgorithm()) {
      gridForAnimationSyncronous = asyncClearGrid(asyncAnimator, animationGrid);
    }

    const visitedPathAnimatedGrid = buildAnimationPath(
      gridForAnimationSyncronous,
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
      () => animationGrid.setGridForAnimation(visitedPathAnimatedGrid)
    );

    const shortestPathAnimatedGrid = buildAnimationPath(
      visitedPathAnimatedGrid,
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
    update: (event: ObservableEvent) => {
      assert(
        animationGrid.gridState && animationGrid.gridForAnimation,
        "grid not fully initialized"
      );

      switch (event) {
        case "RUN_ALGORITHM":
          runPathFindingAnimation();
          break;
        case "CLEAR_ALGORITHM":
          asyncAnimator.stopAnimations();
          asyncClearGrid(asyncAnimator, animationGrid);
          asyncAnimator.animate();
          break;
      }
    },
  };
}

const asyncClearGrid = (
  asyncAnimator: ReturnType<typeof useAsyncAnimator>,
  animationGrid: AnimationGrid
) => {
  const clearedGrid = buildAnimationVanishedPath(
    animationGrid.gridForAnimation!
  );
  asyncAnimator.queueAnimation(
    "ANIMATE_VANISH_GRID",
    Node.VANISH_ANIMATION_DURATION_MILLI_SECS,
    () => {
      assert(animationGrid.gridForAnimation);
      return animationGrid.setGridForAnimation(clearedGrid);
    }
  );
  return clearedGrid;
};

const buildAnimationVanishedPath = (grid: NodeForAnimation[][]) =>
  buildZeroAnimationDelayGrid(grid, Node.vanishPathFrom);

const buildZeroAnimationDelayGrid = (
  grid: NodeForAnimation[][],
  stateMap: (state: Node.State) => Node.State
) =>
  grid.map((row) =>
    row.map((node) =>
      Node.isPath(node.state)
        ? {
            ...node,
            state: stateMap(node.state),
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
      state,
      animationDelay: incrementalSpeedFactorMilliSecs * idx,
    };
  });

  return grid;
};
