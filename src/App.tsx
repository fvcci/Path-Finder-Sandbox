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
): Dimensions => {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    if (width && height) {
      return;
    }

    const { width: newWidth, height: newHeight } =
      ref.current.getBoundingClientRect();
    setWidth(newWidth);
    setHeight(newHeight);
  }, [ref, width, height]);

  return width && height
    ? {
        rows: Math.max(Math.floor(height * compression) + addend, 2),
        cols: Math.max(Math.floor(width * compression) + addend, 2),
      }
    : { rows: null, cols: null };
};
