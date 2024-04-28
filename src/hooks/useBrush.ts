import { useState } from "react";
import * as Node from "../components/Node";
import useAnimationGrid, { isDisplayingAlgorithm } from "./useAnimationGrid";
import { assert } from "../util/asserts";
import { inBounds } from "../algorithms/Algorithm";

export const useBrush = (
  animationGrid: ReturnType<typeof useAnimationGrid>
) => {
  const [brush, setBrush] = useState<Node.Node<Node.Obstruction> | null>(null);

  return {
    onMouseDown: (pos: Node.Position) => {
      if (isDisplayingAlgorithm(animationGrid.gridForAnimation)) {
        return;
      }
      const brushNew = {
        weight: -1,
        state: "WALL" as Node.Obstruction,
      };
      setBrush(brushNew);
      brushOn(animationGrid, pos, brushNew);
    },
    onMouseEnter: (pos: Node.Position) => {
      brushOn(animationGrid, pos, brush);
    },
    onMouseUp: () => {
      setBrush(null);
    },
  };
};

const brushOn = (
  animationGrid: ReturnType<typeof useAnimationGrid>,
  pos: Node.Position,
  brush: Node.Node<Node.Obstruction> | null
) => {
  if (!animationGrid.gridForAnimation || !brush) {
    return;
  }
  assert(inBounds(animationGrid.gridForAnimation, pos));

  const grid = animationGrid.gridForAnimation.map((row) =>
    row.map((node) => ({ ...node }))
  );
  grid[pos.row][pos.col] = {
    ...Node.toggleVanishObstructionState(grid[pos.row][pos.col], brush),
    animationDelay: grid[pos.row][pos.col].animationDelay,
  };
  animationGrid.setGrids(grid);
};
