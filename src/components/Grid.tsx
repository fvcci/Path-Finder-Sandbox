/* eslint-disable no-mixed-operators */
import { useEffect } from "react";

// local imports
import * as Node from "../util/Node";
import useToolBarContext from "../hooks/useToolBarContext";
import useBrush from "../hooks/useBrush";
import useMouseDraggedNode from "../hooks/useMouseDraggedNode";
import useGridAnimator, {
  isDisplayingAlgorithm,
} from "../hooks/useGridAnimator";
import useAnimationGrid, { AnimationGrid } from "../hooks/useAnimationGrid";

export default function Grid() {
  const animationGrid = useAnimationGrid(
    { rows: 0.15, cols: 0.2 },
    { rows: 0.5, cols: 0.6 }
  );

  const STEPS_SPEED_FACTOR_MILLI_SECS = 8;
  const gridAnimator = useGridAnimator(
    animationGrid,
    STEPS_SPEED_FACTOR_MILLI_SECS,
    STEPS_SPEED_FACTOR_MILLI_SECS * 4
  );

  const mouseController = useMouseController(animationGrid);

  const toolBar = useToolBarContext();
  useEffect(() => {
    if (animationGrid.gridForAnimation) {
      toolBar.runButton.enlistToNotify("ANIMATION_GRID", gridAnimator);
    }
  }, [toolBar.runButton, animationGrid, gridAnimator]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-theme-primary-4">
      <div className="outline outline-4 outline-theme-primary-2 p-1">
        <table
          className="outline outline-1 outline-theme-primary-2 p-1 border-spacing-0 border-collapse"
          cellSpacing="0"
        >
          <tbody className="whitespace-pre">
            {animationGrid.gridForAnimation?.map((rowNodes, rowIdx) => (
              <tr key={rowIdx}>
                {rowNodes.map((node, colIdx) => (
                  <td
                    key={colIdx}
                    className="table-cell p-0 min-w-6 min-h-6 border-[1px] border-theme-primary-2"
                  >
                    <div
                      className={Node.STATE_STYLES.BASE}
                      {...mouseController({ row: rowIdx, col: colIdx })}
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

const useMouseController = (animationGrid: AnimationGrid) => {
  const brush = useBrush();
  const mouseDraggedNode = useMouseDraggedNode();
  return (pos: Node.Position) => ({
    onMouseDown: () => {
      if (
        !animationGrid.gridForAnimation ||
        isDisplayingAlgorithm(animationGrid.gridForAnimation)
      ) {
        return;
      }

      if (
        Node.isDestination(
          animationGrid.gridForAnimation[pos.row][pos.col].state
        )
      ) {
        mouseDraggedNode.pickUpNodeFrom(animationGrid, pos);
        return;
      }
      brush.placeBrushDownOnto(animationGrid, pos);
    },
    onMouseEnter: () => {
      if (
        !animationGrid.gridForAnimation ||
        isDisplayingAlgorithm(animationGrid.gridForAnimation)
      ) {
        return;
      }

      brush.drawOn(animationGrid, pos);
      mouseDraggedNode.dragNodeOver(animationGrid, pos);
    },
    onMouseUp: () => {
      if (
        !animationGrid.gridForAnimation ||
        isDisplayingAlgorithm(animationGrid.gridForAnimation)
      ) {
        return;
      }

      brush.releaseBrush();
      mouseDraggedNode.releaseNode(animationGrid);
    },
  });
};
