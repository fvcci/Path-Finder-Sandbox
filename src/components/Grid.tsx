/* eslint-disable no-mixed-operators */
import { useState, useEffect } from "react";

// local imports
import * as Node from "./Node";
import useVisualGrid, { NodeForAnimation } from "../hooks/useVisualGrid";
import { useToolBarContext } from "../hooks/useToolBarContext";
import { ObservableEvent, Observer } from "../util/observer";
import { assert } from "../util/asserts";

export default function Grid({ rows, cols }: { rows: number; cols: number }) {
  const start = useInitialPosition(rows, cols, 0.15, 0.2);
  const end = useInitialPosition(rows, cols, 0.5, 0.6);
  const visualGrid = useVisualGrid(rows, cols, start.position, end.position);

  const toolBar = useToolBarContext();
  const algorithmVisualizer = useAlgorithmVisualizer(
    {
      gridState: visualGrid.gridState,
      setGridState: visualGrid.setGridForAnimation,
    },
    start.position,
    end.position,
    8
  );
  toolBar.runButton.enlistToNotify(algorithmVisualizer);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-primary-4">
      <div className="outline outline-4 outline-primary-2 p-1">
        <table
          className="outline outline-1 outline-primary-2 p-1 border-spacing-0 border-collapse"
          cellSpacing="0"
        >
          <tbody className="whitespace-pre">
            {visualGrid.gridForAnimation.map((rowNodes, rowIdx) => (
              <tr key={rowIdx}>
                {rowNodes.map((node, colIdx) => (
                  <td
                    key={colIdx}
                    className="table-cell p-0 min-w-6 min-h-6 border-[1px] border-primary-2"
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
  gridAPI: {
    gridState: Node.Node[][];
    setGridState: (grid: NodeForAnimation[][]) => void;
  },
  start: Node.Position,
  end: Node.Position,
  speedFactorMiliSecs: number
): Observer => {
  const toolBar = useToolBarContext();
  const run = () => {
    if (gridAPI.gridState.length === 0) {
      return;
    }

    const { steps, shortestPath } = toolBar.selectedAlgorithm.run(
      gridAPI.gridState,
      start,
      end
    );

    const gridForAnimation: NodeForAnimation[][] = gridAPI.gridState.map(
      (row) => row.map((node) => ({ ...node, animationDelay: 0 }))
    );

    steps.forEach((step, idx) => {
      assert(gridForAnimation[step.row][step.col]);
      gridForAnimation[step.row][step.col] = {
        ...gridForAnimation[step.row][step.col],
        state: "VISITED",
        animationDelay: speedFactorMiliSecs * idx,
      };
    });

    gridAPI.setGridState(gridForAnimation);

    const stepsDuration = steps.length * speedFactorMiliSecs;
    const shortestPathSpeedFactorMilliSecs = speedFactorMiliSecs * 4;

    setTimeout(() => {
      shortestPath.forEach((shortestPathStep, idx) => {
        assert(gridForAnimation[shortestPathStep.row][shortestPathStep.col]);
        gridForAnimation[shortestPathStep.row][shortestPathStep.col] = {
          ...gridForAnimation[shortestPathStep.row][shortestPathStep.col],
          state: "SHORTEST_PATH",
          animationDelay: shortestPathSpeedFactorMilliSecs * idx,
        };
      });

      gridAPI.setGridState(gridForAnimation);
    }, stepsDuration);

    const shortestPathDuration =
      shortestPath.length * shortestPathSpeedFactorMilliSecs;
    setTimeout(() => {
      toolBar.runButton.notifyObservers("ALGORITHM FINISHED RUNNING");
    }, stepsDuration + shortestPathDuration);
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
