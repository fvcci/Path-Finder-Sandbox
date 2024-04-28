/* eslint-disable no-mixed-operators */
import { useState, useEffect } from "react";

// local imports
import * as Node from "./Node";
import useAnimationGrid, {
  Dimensions,
  isDisplayingAlgorithm,
} from "../hooks/useAnimationGrid";
import { useToolBarContext } from "../hooks/useToolBarContext";
import { inBounds } from "../algorithms/Algorithm";

export default function Grid({ dimensions }: { dimensions: Dimensions }) {
  const start = useInitialPosition(dimensions, 0.15, 0.2);
  const end = useInitialPosition(dimensions, 0.5, 0.6);
  const STEPS_SPEED_FACTOR_MILLI_SECS = 8;
  const animationGrid = useAnimationGrid(
    dimensions,
    start.position,
    end.position,
    STEPS_SPEED_FACTOR_MILLI_SECS,
    STEPS_SPEED_FACTOR_MILLI_SECS * 4
  );

  const [brush, setBrush] = useState<Node.Node<Node.Obstruction> | null>(null);

  const toolBar = useToolBarContext();
  toolBar.runButton.enlistToNotify(animationGrid);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-theme-primary-4">
      <div className="outline outline-4 outline-theme-primary-2 p-1">
        <table
          className="outline outline-1 outline-theme-primary-2 p-1 border-spacing-0 border-collapse"
          cellSpacing="0"
        >
          <tbody className="whitespace-pre">
            {animationGrid.getGridForAnimation().map((rowNodes, rowIdx) => (
              <tr key={rowIdx}>
                {rowNodes.map((node, colIdx) => (
                  <td
                    key={colIdx}
                    className="table-cell p-0 min-w-6 min-h-6 border-[1px] border-theme-primary-2"
                  >
                    <div
                      className={Node.STATE_STYLES.BASE}
                      onMouseDown={() => {
                        if (
                          isDisplayingAlgorithm(
                            animationGrid.getGridForAnimation(),
                            start.position
                          )
                        ) {
                          return;
                        }
                        const brushNew = {
                          weight: -1,
                          state: "WALL" as Node.Obstruction,
                        };
                        setBrush(brushNew);
                        brushOn(
                          animationGrid,
                          { row: rowIdx, col: colIdx },
                          brushNew
                        );
                      }}
                      onMouseEnter={() => {
                        brushOn(
                          animationGrid,
                          { row: rowIdx, col: colIdx },
                          brush
                        );
                      }}
                      onMouseUp={() => {
                        console.log(
                          animationGrid.getGridForAnimation(),
                          animationGrid.getGridState()
                        );
                        setBrush(null);
                      }}
                    >
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
  dimensions: Dimensions,
  initialRowPercent: number,
  initialColPercent: number
) => {
  const [pos, setPosition] = useState<Node.Position | null>(null);

  useEffect(() => {
    if (!dimensions.rows || !dimensions.cols) {
      return;
    }

    setPosition({
      row: Math.floor(dimensions.rows * initialRowPercent),
      col: Math.floor(dimensions.cols * initialColPercent),
    });
  }, [dimensions.rows, dimensions.cols, initialRowPercent, initialColPercent]);

  return { position: pos, setPosition };
};

const brushOn = (
  animationGrid: ReturnType<typeof useAnimationGrid>,
  pos: Node.Position,
  brush: Node.Node<Node.Obstruction> | null
) => {
  if (!brush || !inBounds(animationGrid.getGridForAnimation(), pos)) {
    return;
  }

  const grid = animationGrid
    .getGridForAnimation()
    .map((row) => row.map((node) => ({ ...node })));
  grid[pos.row][pos.col] = {
    ...Node.toggleVanishObstructionState(grid[pos.row][pos.col], brush),
    animationDelay: grid[pos.row][pos.col].animationDelay,
  };
  animationGrid.setGrids(grid);
};
