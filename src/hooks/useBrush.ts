import { useState } from "react";
import * as Node from "../lib/Node";
import { AnimationGrid } from "./useAnimationGrid";
import assert from "../lib/assert";

export default function useBrush() {
  const [brush, setBrush] = useState<Node.Node<Node.Obstruction> | null>(null);

  return {
    placeBrushDownOnto: (animationGrid: AnimationGrid, pos: Node.Position) => {
      const brushNew = {
        weight: -1,
        state: "WALL" as Node.Obstruction,
      };
      setBrush(brushNew);
      animationGrid.setGrids(buildBrushOn(animationGrid, pos, brushNew));
    },
    drawOn: (animationGrid: AnimationGrid, pos: Node.Position) => {
      if (brush) {
        animationGrid.setGrids(buildBrushOn(animationGrid, pos, brush));
      }
    },
    releaseBrush: () => {
      setBrush(null);
    },
  };
}

const buildBrushOn = (
  animationGrid: AnimationGrid,
  pos: Node.Position,
  brush: Node.Node<Node.Obstruction>
) => {
  assert(
    animationGrid.gridForAnimation &&
      Node.inBounds(animationGrid.gridForAnimation, pos)
  );

  const grid = animationGrid.gridForAnimation.map((row) =>
    row.map((node) => ({ ...node }))
  );
  grid[pos.row][pos.col] = {
    ...Node.toggleObstructionVanishState(grid[pos.row][pos.col], brush),
    animationDelay: grid[pos.row][pos.col].animationDelay,
  };
  return grid;
};
