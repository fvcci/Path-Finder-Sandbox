import * as Node from "@/lib/Node";
import useToolBarContext from "@/hooks/useToolBarContext";
import useBrush from "@/hooks/useBrush";
import useMouseDraggedNode from "@/hooks/useMouseDraggedNode";
import assert from "@/lib/assert";
import { AnimationGrid } from "@/hooks/useAnimationGrid";

export default function useMouseController(animationGrid: AnimationGrid) {
  const brush = useBrush();
  const mouseDraggedNode = useMouseDraggedNode();
  const toolBar = useToolBarContext();

  if (!animationGrid.gridForAnimation) {
    return () => {};
  }

  return (pos: Node.Position) => ({
    onMouseDown: () => {
      assert(animationGrid.gridForAnimation);
      if (
        Node.isDestination(
          animationGrid.gridForAnimation[pos.row][pos.col].state
        )
      ) {
        mouseDraggedNode.pickUpNodeFrom(animationGrid, pos);
        toolBar.runButton.notifyObservers("CLEAR_ALGORITHM");
        return;
      }

      if (!toolBar.runButton.isDisplayingAlgorithm()) {
        brush.placeBrushDownOnto(animationGrid, pos);
      }
    },
    onMouseEnter: () => {
      if (!toolBar.runButton.isDisplayingAlgorithm()) {
        brush.drawOn(animationGrid, pos);
      }

      mouseDraggedNode.dragNodeOver(animationGrid, pos);
    },
    onMouseUp: () => {
      brush.releaseBrush();
      mouseDraggedNode.releaseNode(animationGrid);
    },
  });
}
