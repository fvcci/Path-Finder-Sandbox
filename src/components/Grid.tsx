/* eslint-disable no-mixed-operators */
import { useState, useEffect } from "react";

// local imports
import * as Node from "./Node";
import useVisualGrid, { NodeForAnimation } from "../hooks/useVisualGrid";
import { useToolBarContext } from "../hooks/useToolBarContext";
import { ObservableEvent, Observer } from "../util/observer";
import { assert } from "../util/asserts";
import { executeAsynchronously } from "../util/async";

export default function Grid({ rows, cols }: { rows: number; cols: number }) {
  const start = useInitialPosition(rows, cols, 0.15, 0.2);
  const end = useInitialPosition(rows, cols, 0.5, 0.6);
  const visualGrid = useVisualGrid(rows, cols, start.position, end.position);

  const stepsSpeedFactorMilliSecs = 8;
  const algorithmVisualizer = useAlgorithmVisualizer(
    visualGrid,
    start.position,
    end.position,
    stepsSpeedFactorMilliSecs,
    stepsSpeedFactorMilliSecs * 4
  );

  const toolBar = useToolBarContext();
  toolBar.runButton.enlistToNotify(algorithmVisualizer);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-theme-primary-4">
      <div className="outline outline-4 outline-theme-primary-2 p-1">
        <table
          className="outline outline-1 outline-theme-primary-2 p-1 border-spacing-0 border-collapse"
          cellSpacing="0"
        >
          <tbody className="whitespace-pre">
            {visualGrid.gridForAnimation.map((rowNodes, rowIdx) => (
              <tr key={rowIdx}>
                {rowNodes.map((node, colIdx) => (
                  <td
                    key={colIdx}
                    className="table-cell p-0 min-w-6 min-h-6 border-[1px] border-theme-primary-2"
                  >
                    <div className={Node.STATE_STYLES.BASE}>
                      <div
                        className={`w-full h-full absolute top-0 left-0 z-10 ${
                          Node.STATE_STYLES.BASE
                        } ${Node.STATE_STYLES[node.state]}`}
                        style={{ animationDelay: node.animationDelay + "ms" }}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const useInitialPosition = (
  rows: number,
  cols: number,
  initialRowPercent: number,
  initialColPercent: number
) => {
  const [pos, setPosition] = useState<Node.Position>({
    row: Math.floor(rows * initialRowPercent),
    col: Math.floor(cols * initialColPercent),
  });

  useEffect(() => {
    if (pos.row !== 0 && pos.col !== 0) {
      return;
    }

    setPosition({
      row: Math.floor(rows * initialRowPercent),
      col: Math.floor(cols * initialColPercent),
    });
  }, [pos, rows, cols, initialRowPercent, initialColPercent]);

  return { position: pos, setPosition };
};

const useAlgorithmVisualizer = (
  visualGrid: ReturnType<typeof useVisualGrid>,
  start: Node.Position,
  end: Node.Position,
  stepsSpeedFactorMilliSecs: number,
  shortestPathSpeedFactorMilliSecs: number
): Observer => {
  const toolBar = useToolBarContext();

  const [count, setCount] = useState(0);

  const run = async () => {
    if (visualGrid.gridState.length === 0) {
      return;
    }

    visualGrid.clearAnimation();

    const { steps, shortestPath } = toolBar.selectedAlgorithm.run(
      visualGrid.gridState,
      start,
      end
    );

    const gridForAnimation: NodeForAnimation[][] =
      visualGrid.gridForAnimation.map((row) => row.map((node) => node));

    const stepsDuration = steps.length * stepsSpeedFactorMilliSecs;

    await executeAsynchronously(stepsDuration, () => {
      steps.forEach((step, idx) => {
        assert(gridForAnimation[step.row][step.col]);
        gridForAnimation[step.row][step.col] = {
          ...gridForAnimation[step.row][step.col],
          state: "VISITED",
          animationDelay: stepsSpeedFactorMilliSecs * idx,
        };
      });
      visualGrid.setGridForAnimation(gridForAnimation);
    });

    if (count === 1) {
      return;
    }
    setCount(1);

    const shortestPathDuration =
      shortestPath.length * shortestPathSpeedFactorMilliSecs;
    await executeAsynchronously(shortestPathDuration, () => {
      shortestPath.forEach((shortestPathStep, idx) => {
        assert(gridForAnimation[shortestPathStep.row][shortestPathStep.col]);
        gridForAnimation[shortestPathStep.row][shortestPathStep.col] = {
          ...gridForAnimation[shortestPathStep.row][shortestPathStep.col],
          state: "SHORTEST_PATH",
          animationDelay: shortestPathSpeedFactorMilliSecs * idx,
        };
      });

      visualGrid.setGridForAnimation(gridForAnimation);
    });

    toolBar.runButton.notifyObservers("ALGORITHM FINISHED RUNNING");
  };

  return {
    update: (event: ObservableEvent) => {
      switch (event) {
        case "RUN ALGORITHM":
          run();
          break;
        case "ABORT ALGORITHM":
          break;
      }
    },
  };
};
