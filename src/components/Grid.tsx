/* eslint-disable no-mixed-operators */
import React, { useState, useEffect, useCallback } from "react";

// local imports
import {
  START_END_RATIO,
  NODE_STATE,
  SPECIAL_STATES,
  ANIMATION_SPEED,
} from "../constants";
import useGrid from "../hooks/useGrid";
import useDraggedNode from "../hooks/useDraggedNode";
import useDraw from "../hooks/useDraw";
import Algorithm from "../algorithms/Algorithm";
import { NodeType } from "./NodeType";
import "./Node.css";

interface GridProps {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  droppedObstruction: number;
  isBrushing: boolean;
  isErasing: boolean;
  isErasingAlgorithm: boolean;
  setIsErasingAlgorithm: (isErasingAlgorithm: boolean) => void;
  rows: number;
  cols: number;
  algorithm: Algorithm;
  animationSpeed: number;
}

const Grid: React.FC<GridProps> = ({
  isRunning,
  setIsRunning,
  droppedObstruction,
  isBrushing,
  isErasing,
  isErasingAlgorithm,
  setIsErasingAlgorithm,
  rows,
  cols,
  algorithm,
  animationSpeed,
}) => {
  const { grid, setGrid, setCell, setCellTopDOM, setCellDOM, clearGridState } =
    useGrid(rows, cols);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [hasProcessedSteps, setHasProcessedSteps] = useState(false);
  const [hasDisplayedPath, setHasDisplayedPath] = useState(false);
  const [pendingAnimations, setPendingAnimations] = useState<number[]>([]);
  const [startNode, setStartNode] = useState<NodeType>({
    row: Math.floor(rows * START_END_RATIO.START.ROW),
    col: Math.floor(cols * START_END_RATIO.START.COL),
    weight: 1,
    state: NODE_STATE.START,
  });
  const {
    draggedNode,
    setDraggedNode,
    previousNode,
    setPreviousNode,
    dragStart,
    dragEnd,
    dragOver,
  } = useDraggedNode(setCell, setCellDOM, setStartNode, clearGridState);
  const { toggleCellWall, brush, erase } = useDraw(setGrid, setCell);

  // Clear state and states that prevent grid interaction after visualization
  const clearCache = useCallback(() => {
    clearGridState(
      [NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH],
      draggedNode!
    );
    for (let i = 0; i < pendingAnimations.length; ++i) {
      clearTimeout(pendingAnimations[i]);
    }

    setHasDisplayedPath(false);
    setHasProcessedSteps(false);
    setPendingAnimations([]);
  }, [clearGridState, pendingAnimations]);

  // visualize the algorithm on the grid
  // ! grid, startCoords, algorithm, and animationSpeed cannot be changed while running
  const visualizeAlgorithm = useCallback(async () => {
    // Clear the grid and stop any previous animation
    const hasDisplayedAlgo = clearGridState(
      [NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH],
      draggedNode!
    );

    // Sleep for the animation time (1.5s)
    // Only sleep when there are toggled nodes
    if (hasDisplayedAlgo) {
      await new Promise((r) => setTimeout(r, 1500));
    }

    const { steps, shortestPath } = algorithm.run(grid, startNode);
    const animations = [];

    // Animate the steps to the algorithm
    for (let i = 0; i < steps.length; ++i) {
      animations.push(
        setTimeout(() => {
          setCellTopDOM({ ...steps[i], state: NODE_STATE.VISITED });
        }, ANIMATION_SPEED.STEPS * i * animationSpeed)
      );
    }

    // Animate the shortest path to end
    for (let i = 0; i < shortestPath.length; ++i) {
      animations.push(
        setTimeout(() => {
          setCellTopDOM({
            ...shortestPath[i],
            state: NODE_STATE.SHORTEST_PATH,
          });
        }, (ANIMATION_SPEED.SHORTEST_PATH * i + ANIMATION_SPEED.STEPS * steps.length) * animationSpeed)
      );
    }

    animations.push(
      setTimeout(() => {
        setIsRunning(false);
        setHasProcessedSteps(false);
      }, (ANIMATION_SPEED.STEPS * steps.length + ANIMATION_SPEED.SHORTEST_PATH * shortestPath.length) * animationSpeed)
    );

    setPendingAnimations(animations);
    setHasDisplayedPath(true);
    setHasProcessedSteps(true);
  }, [
    setIsRunning,
    grid,
    algorithm,
    animationSpeed,
    clearGridState,
    startNode,
  ]);

  const handleMouseDown = (row: number, col: number) => {
    console.log("mouse down", grid);
    if (isRunning) return;
    setMouseIsPressed(true);

    // Set the dragged item
    if (SPECIAL_STATES.includes(grid[row][col].state)) {
      dragStart(grid, row, col);
      if (hasDisplayedPath) {
        clearCache();
      }

      // Start toggling cells between wall and none
    } else if (!hasDisplayedPath) {
      if (isBrushing) {
        brush(grid, row, col, droppedObstruction);
      } else if (isErasing) {
        erase(grid, row, col);
      } else {
        toggleCellWall(grid, row, col, droppedObstruction);
      }
      setPreviousNode(grid[row][col]);
    }
  };

  // * executed after handleMouseLeave
  const handleMouseEnter = (row: number, col: number) => {
    // Move the start node around with the mouse
    if (!mouseIsPressed) return;

    // When you are dragging the start/end node
    if (draggedNode) {
      dragOver(grid, row, col);

      // Toggle the entered cell between a wall or none
    } else if (
      !isRunning &&
      !hasDisplayedPath &&
      !hasProcessedSteps &&
      !SPECIAL_STATES.includes(grid[row][col].state) &&
      // There's a bug that registers 2 enters in a square when you enter
      // only once. So this prevents that.
      (previousNode!.row !== row || previousNode!.col !== col)
    ) {
      if (isBrushing) {
        brush(grid, row, col, droppedObstruction);
      } else if (isErasing) {
        erase(grid, row, col);
      } else {
        toggleCellWall(grid, row, col, droppedObstruction);
      }
      setPreviousNode(grid[row][col]);
    }
  };

  // Replace current cell with og state after changed to start/end node
  // * executed before handleMouseEnter
  const handleMouseLeave = (row: number, col: number) => {
    if (!draggedNode || !mouseIsPressed) return;
    // if start, then end else start
    const oppositeSide =
      draggedNode.state === NODE_STATE.START
        ? NODE_STATE.END
        : NODE_STATE.START;

    // don't remove previous node if it's START or END
    if (grid[row][col].state !== oppositeSide) {
      setCellDOM(grid[row][col]);
    }
  };

  // Stop toggling cells between wall and none
  const handleMouseUp = () => {
    // Set the new start/end node position
    if (draggedNode) {
      dragEnd();
    }

    setDraggedNode(null);
    setMouseIsPressed(false);
  };

  useEffect(() => {
    // Clear the animation if visualizing but the user aborted
    if (!isRunning && hasProcessedSteps) {
      clearCache();
      return;

      // run the algorithm if user pressed play
      // and it has not been run before
    } else if (isRunning && !hasProcessedSteps) {
      visualizeAlgorithm();
    }
  }, [isRunning, hasProcessedSteps, clearCache, visualizeAlgorithm]);

  // hasProcessedSteps must be the same as isRunning
  useEffect(() => setHasProcessedSteps(isRunning), [isRunning]);

  // detect an update inside isErasingAlgorithm
  useEffect(() => {
    if (isErasingAlgorithm && !isRunning) {
      clearCache();
    }
    setIsErasingAlgorithm(false);
  }, [isErasingAlgorithm]);

  // update start node
  useEffect(() => {
    setStartNode({
      ...startNode,
      row: Math.floor(rows * START_END_RATIO.START.ROW),
      col: Math.floor(cols * START_END_RATIO.START.COL),
    });
  }, [rows, cols]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-darkest-blue">
      <div
        className="outline outline-4 outline-pale-blue p-1"
        onMouseUp={handleMouseUp}
      >
        <table
          className="outline outline-1 outline-pale-blue p-1 border-spacing-0 border-collapse"
          cellSpacing="0"
        >
          <tbody className="whitespace-pre">
            {grid.map((rowNodes, rowIdx) => (
              <tr key={rowIdx}>
                {rowNodes.map((node, nodeIdx) => (
                  <td
                    key={nodeIdx}
                    className="table-cell relative p-0 min-w-6 min-h-6 border-[1px] border-pale-blue"
                    onMouseDown={() => handleMouseDown(node.row, node.col)}
                    onMouseUp={handleMouseUp}
                    onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                    onMouseLeave={() => handleMouseLeave(node.row, node.col)}
                  >
                    <div
                      id={`top-node-${node.row}-${node.col}`}
                      className={`top ${NODE_STATE.DEFAULT}`}
                    />
                    <div
                      id={`node-${node.row}-${node.col}`}
                      className={`${NODE_STATE.DEFAULT} ${node.state}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grid;
