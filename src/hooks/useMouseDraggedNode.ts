import { useState } from "react";
import * as Node from "../components/Node";
import { AnimationGrid } from "./useAnimationGrid";
import { assert } from "../util/asserts";
import { inBounds } from "../algorithms/Algorithm";

export default function useMouseDraggedNode() {
  const [mouseDraggedNode, setMouseDraggedNode] = useState<
    (Node.Node<Node.State> & Node.Position) | null
  >(null);

  return {
    pickUpNodeFrom: (animationGrid: AnimationGrid, pos: Node.Position) => {
      assert(animationGrid.gridForAnimation);
      setMouseDraggedNode({
        ...(animationGrid.gridForAnimation[pos.row][
          pos.col
        ] as Node.Node<Node.State>),
        ...pos,
      });
    },
    dragNodeOver: (animationGrid: AnimationGrid, pos: Node.Position) => {
      if (!mouseDraggedNode) {
        return;
      }

      assert(animationGrid.gridForAnimation);

      const newMouseDraggedNode = Node.isDestination(
        animationGrid.gridForAnimation[pos.row][pos.col].state
      )
        ? mouseDraggedNode
        : {
            ...mouseDraggedNode,
            ...pos,
          };

      animationGrid.setGridForAnimation(
        buildMouseDraggedNodeOnto(
          animationGrid,
          newMouseDraggedNode,
          mouseDraggedNode
        )
      );
      setMouseDraggedNode(newMouseDraggedNode);
    },
    releaseNode: (animationGrid: AnimationGrid) => {
      if (!mouseDraggedNode) {
        return;
      }

      animationGrid.setGrids(
        buildMouseDraggedNodeOnto(
          animationGrid,
          mouseDraggedNode,
          mouseDraggedNode
        )
      );
      setMouseDraggedNode(null);
    },
  };
}

const buildMouseDraggedNodeOnto = (
  animationGrid: AnimationGrid,
  mouseDraggedNode: Node.Node<Node.State> & Node.Position,
  prevMouseDraggedPos: Node.Position
) => {
  assert(
    animationGrid.gridForAnimation &&
      animationGrid.gridState &&
      inBounds(animationGrid.gridForAnimation, mouseDraggedNode)
  );

  const grid = animationGrid.gridForAnimation.map((row) =>
    row.map((node) => ({ ...node }))
  );

  const prevState =
    animationGrid.gridState[prevMouseDraggedPos.row][prevMouseDraggedPos.col]
      .state;

  grid[prevMouseDraggedPos.row][prevMouseDraggedPos.col].state =
    prevState === mouseDraggedNode.state ? "BASE" : prevState;

  grid[mouseDraggedNode.row][mouseDraggedNode.col] = {
    ...mouseDraggedNode,
    animationDelay: 0,
  };
  return grid;
};
