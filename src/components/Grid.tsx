/* eslint-disable no-mixed-operators */
import { useState, useEffect } from "react";

// local imports
import * as Node from "./Node";
import useGrid from "../hooks/useGrid";
import "./Node.css";

const ANIMATION_SPEED = {
  STEPS: 8,
  SHORTEST_PATH: 30,
};

export default function Grid({ rows, cols }: { rows: number; cols: number }) {
  const start = useInitialPosition(rows, cols, 0.15, 0.2);
  const end = useInitialPosition(rows, cols, 0.5, 0.6);
  const visualizedGrid = useGrid(rows, cols, start.position, end.position);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-darkest-blue">
      <div className="outline outline-4 outline-pale-blue p-1">
        <table
          className="outline outline-1 outline-pale-blue p-1 border-spacing-0 border-collapse"
          cellSpacing="0"
        >
          <tbody className="whitespace-pre">
            {visualizedGrid.grid.map((rowNodes, rowIdx) => (
              <tr key={rowIdx}>
                {rowNodes.map((node, colIdx) => {
                  const pos: Node.Position = { row: rowIdx, col: colIdx };
                  return (
                    <td
                      key={colIdx}
                      className="table-cell relative p-0 min-w-6 min-h-6 border-[1px] border-pale-blue"
                    >
                      <div
                        id={`top-node-${pos.row}-${pos.col}`}
                        className={`top node`}
                      />
                      <div
                        id={`node-${pos.row}-${pos.col}`}
                        className={`node ${node.state}`}
                      />
                    </td>
                  );
                })}
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
