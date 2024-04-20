import React, { useState, useLayoutEffect, createRef } from "react";

// local imports
import ToolBar from "./components/ToolBar";
import Grid from "./components/Grid";

export default function App() {
  // Tools
  const [isErasingAlgorithm, setIsErasingAlgorithm] = useState(false);

  // const [algorithm, setAlgorithm] = useState(new AStar());
  // const [animationSpeed, setAnimationSpeed] = useState(1);
  const ref = createRef<HTMLDivElement>();
  const { width, height } = useDimensions(ref, 1 / 24, -6);

  return (
    <div className="flex flex-col w-screen h-screen bg-primary-1">
      <header className="flex-initial">
        <ToolBar
          isErasingAlgorithm={{
            val: isErasingAlgorithm,
            set: setIsErasingAlgorithm,
          }}
        />
      </header>
      <main className="flex-auto relative" ref={ref}>
        <Grid rows={Math.max(height, 0)} cols={Math.max(width, 0)} />
      </main>
    </div>
  );
}

const useDimensions = (
  ref: React.RefObject<HTMLDivElement>,
  compression = 1,
  addend = 0
) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    if (width !== 0 && height !== 0) {
      return;
    }

    const { width: newWidth, height: newHeight } =
      ref.current.getBoundingClientRect();
    setWidth(Math.round(newWidth));
    setHeight(Math.round(newHeight));
  }, [ref, width, height]);

  return width !== 0 && height !== 0
    ? {
        width: Math.floor(width * compression) + addend,
        height: Math.floor(height * compression) + addend,
      }
    : { width: 0, height: 0 };
};
