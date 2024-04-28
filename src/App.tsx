import React, { useState, useLayoutEffect, createRef } from "react";

// local imports
import ToolBar from "./components/ToolBar";
import Grid from "./components/Grid";
import * as ToolBarContext from "./context/ToolBarContext";
import { Dimensions } from "./hooks/useAnimationGrid";

export default function App() {
  const ref = createRef<HTMLDivElement>();
  const dimensions = useDimensions(ref, 1 / 24, -6);

  return (
    <div className="flex flex-col w-screen h-screen bg-theme-primary-1">
      <ToolBarContext.Provider>
        <header className="flex-initial">
          <ToolBar />
        </header>
        <main className="flex-auto relative" ref={ref}>
          <Grid dimensions={dimensions} />
        </main>
      </ToolBarContext.Provider>
    </div>
  );
}

// TODO make app dimensions a context maybe
const useDimensions = (
  ref: React.RefObject<HTMLDivElement>,
  compression = 1,
  addend = 0
): Dimensions | null => {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    if (dimensions) {
      return;
    }

    const { width: newWidth, height: newHeight } =
      ref.current.getBoundingClientRect();
    setDimensions({ width: newWidth, height: newHeight });
  }, [ref, dimensions]);

  return dimensions
    ? {
        rows: Math.max(Math.floor(dimensions.height * compression) + addend, 2),
        cols: Math.max(Math.floor(dimensions.width * compression) + addend, 2),
      }
    : null;
};
