/* eslint-disable no-mixed-operators */
import React, { useState, useEffect, useCallback } from "react";

// local imports
import * as Node from "./Node";
import { NODE_STATE, SPECIAL_STATES } from "../constants";
import useGrid from "../hooks/useGrid";
import useDraw from "../hooks/useDraw";
import LAlgorithm from "../algorithms/Algorithm";
import "./Node.css";

const ANIMATION_SPEED = {
  STEPS: 8,
  SHORTEST_PATH: 30,
};

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
  algorithm: LAlgorithm;
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
  const { start, end, grid, setGrid, setCell, setCellTopDOM, clearGridState } =
    useGrid(rows, cols);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [hasProcessedSteps, setHasProcessedSteps] = useState(false);
  const [hasDisplayedPath, setHasDisplayedPath] = useState(false);
  const [pendingAnimations, setPendingAnimations] = useState<number[]>([]);
  const { toggleCellWall, brush, erase } = useDraw(setGrid, setCell);

  // Clear state and states that prevent grid interaction after visualization
  const clearCache = useCallback(() => {
    clearGridState([NODE_STATE.VISITED, NODE_STATE.SHORTEST_PATH]);
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
    const hasDisplayedAlgo = clearGridState([
      NODE_STATE.VISITED,
      NODE_STATE.SHORTEST_PATH,
    ]);

    // Sleep for the animation time (1.5s)
    // Only sleep when there are toggled nodes
    if (hasDisplayedAlgo) {
      await new Promise((r) => setTimeout(r, 1500));
    }

    const { steps, shortestPath } = algorithm.run(grid, start.position);
    const animations = [];

    // Animate the steps to the algorithm
    for (let i = 0; i < steps.length; ++i) {
      animations.push(
        setTimeout(() => {
          setCellTopDOM(
            {
              weight: grid[steps[i].row][steps[i].col].weight,
              state: NODE_STATE.VISITED,
            },
            steps[i]
          );
        }, ANIMATION_SPEED.STEPS * i * animationSpeed)
      );
    }

    // Animate the shortest path to end
    for (let i = 0; i < shortestPath.length; ++i) {
      animations.push(
        setTimeout(() => {
          setCellTopDOM(
            {
              weight: grid[shortestPath[i].row][shortestPath[i].col].weight,
              state: NODE_STATE.SHORTEST_PATH,
            },
            shortestPath[i]
          );
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
    start.position,
  ]);

  const handleMouseDown = (pos: Node.Position) => {
    console.log("mouse down", grid);
    if (isRunning) return;
    setMouseIsPressed(true);

    // Set the dragged item
    if (SPECIAL_STATES.includes(grid[pos.row][pos.col].state)) {
      if (hasDisplayedPath) {
        clearCache();
      }

      // Start toggling cells between wall and none
    } else if (!hasDisplayedPath) {
      if (isBrushing) {
        brush(grid, pos, droppedObstruction);
      } else if (isErasing) {
        erase(grid, pos);
      } else {
        toggleCellWall(grid, pos, droppedObstruction);
      }
    }
  };

  // * executed after handleMouseLeave
  const handleMouseEnter = (pos: Node.Position) => {
    // Move the start node around with the mouse
    if (!mouseIsPressed) return;

    // Toggle the entered cell between a wall or none
    if (
      !isRunning &&
      !hasDisplayedPath &&
      !hasProcessedSteps &&
      !SPECIAL_STATES.includes(grid[pos.row][pos.col].state)
    ) {
      if (isBrushing) {
        brush(grid, pos, droppedObstruction);
      } else if (isErasing) {
        erase(grid, pos);
      } else {
        toggleCellWall(grid, pos, droppedObstruction);
      }
    }
  };

  // Replace current cell with og state after changed to start/end node
  // * executed before handleMouseEnter
  const handleMouseLeave = (pos: Node.Position) => {
    if (!mouseIsPressed) return;
    setCellTopDOM(grid[pos.row][pos.col], pos);
  };

  // Stop toggling cells between wall and none
  const handleMouseUp = () => {
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
                {rowNodes.map((node, colIdx) => {
                  const pos: Node.Position = { row: rowIdx, col: colIdx };
                  return (
                    <td
                      key={colIdx}
                      className="table-cell relative p-0 min-w-6 min-h-6 border-[1px] border-pale-blue"
                      onMouseDown={() => handleMouseDown(pos)}
                      onMouseUp={handleMouseUp}
                      onMouseEnter={() => handleMouseEnter(pos)}
                      onMouseLeave={() => handleMouseLeave(pos)}
                    >
                      <div
                        id={`top-node-${pos.row}-${pos.col}`}
                        className={`top ${NODE_STATE.DEFAULT}`}
                      />
                      <div
                        id={`node-${pos.row}-${pos.col}`}
                        className={`${NODE_STATE.DEFAULT} ${node.state}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grid;
