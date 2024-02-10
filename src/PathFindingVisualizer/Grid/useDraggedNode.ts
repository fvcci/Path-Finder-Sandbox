import React, { useState, useEffect, useCallback } from "react";
import { NodeType } from "../Node";

// import local files
import { NODE_STATE } from "../../constants";

interface useDragType {
  draggedNode: NodeType | null;
  setDraggedNode: React.Dispatch<React.SetStateAction<NodeType | null>>;
  previousNode: NodeType | null;
  setPreviousNode: React.Dispatch<React.SetStateAction<NodeType | null>>;
  dragStart: (grid: NodeType[][], row: number, col: number) => void;
  dragOver: (grid: NodeType[][], row: number, col: number) => void;
  dragEnd: () => void;
}

const useDraggedNode = (
  setCell: (node: NodeType) => void,
  setCellDOM: (node: NodeType) => void,
  setStartNode: (node: NodeType) => void,
  clearState: (state: string[], node: NodeType) => void
): useDragType => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);
  const [previousNode, setPreviousNode] = useState<NodeType | null>(null);

  const dragStart = (grid: NodeType[][], row: number, col: number) => {
    setDraggedNode(grid[row][col]);

    // Will remove the og start/end node
    setPreviousNode({ ...grid[row][col], state: "" });
  };

  const dragOver = (grid: NodeType[][], row: number, col: number) => {
    // Case start and end node overlap, don't move the draggedNode
    if (
      [draggedNode!.state, grid[row][col].state].includes(NODE_STATE.START) &&
      [draggedNode!.state, grid[row][col].state].includes(NODE_STATE.END)
    ) {
      setCellDOM(draggedNode!);
      return;
    }

    // Set the current row and col to be start/end
    const newDraggedNode = { ...draggedNode!, row: row, col: col };
    setDraggedNode(newDraggedNode);
    setCell(newDraggedNode);
    setCellDOM(newDraggedNode);

    // Remove the previous node and update it to the current node
    // * case it went over a start/end node previously, this removes the copy
    setCell(previousNode!);
    setCellDOM(previousNode!);

    // If there is a reverse at the end, remove it
    if (grid[row][col].state!.includes("reverse")) {
      setPreviousNode({ ...grid[row][col], state: "" });
    } else {
      setPreviousNode(grid[row][col]);
    }
  };

  const dragEnd = () => {
    // Sometimes there's a start/end node duplicate so delete it
    clearState([draggedNode!.state!], draggedNode!);
    setCell(draggedNode!);
    // setCellDOM(draggedNode);

    if (draggedNode!.state === NODE_STATE.START) {
      setStartNode(draggedNode!);
    }
  };

  return {
    draggedNode,
    setDraggedNode,
    previousNode,
    setPreviousNode,
    dragStart,
    dragOver,
    dragEnd,
  };
};

export default useDraggedNode;
