import React from "react";

import { NODE_STATE } from "../../constants";
import "./Node.css";

export interface NodeType {
  row: number;
  col: number;
  weight: number;
  state: string;
}

interface NodeProps {
  row: number;
  col: number;
  state: string;
  onMouseDown: (row: number, col: number) => void;
  onMouseUp: () => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseLeave: (row: number, col: number) => void;
}

export const Node: React.FC<NodeProps> = ({
  row,
  col,
  state,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <td
      onMouseDown={() => onMouseDown(row, col)}
      onMouseUp={onMouseUp}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseLeave={() => onMouseLeave(row, col)}
    >
      <div
        id={`top-node-${row}-${col}`}
        className={`top ${NODE_STATE.DEFAULT}`}
      />
      <div
        id={`node-${row}-${col}`}
        className={`${NODE_STATE.DEFAULT} ${state}`}
      />
    </td>
  );
};
