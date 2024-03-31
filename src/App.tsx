import React, { useState, useLayoutEffect, createRef } from "react";

// local imports
import ToolBar from "./components/ToolBar";
import Grid from "./components/Grid";
import AStar from "./algorithms/Astar";

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);

  // Tools
  const [droppedObstruction, setDroppedObstruction] = useState(0);
  const [isBrushing, setIsBrushing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isErasingAlgorithm, setIsErasingAlgorithm] = useState(false);

  // const [algorithm, setAlgorithm] = useState(new AStar());
  // const [animationSpeed, setAnimationSpeed] = useState(1);
  const algorithm = new AStar();
  const animationSpeed = 1;

  const ref = createRef<HTMLDivElement>();
  const { width, height } = useDimensions(ref, 1 / 24, -10);

  return (
    <div className="flex flex-col w-screen h-screen bg-background">
      <header className="flex-initial">
        <ToolBar
          runButton={{ val: isRunning, set: setIsRunning }}
          droppedObstruction={{
            val: droppedObstruction,
            set: setDroppedObstruction,
          }}
          isBrushing={{ val: isBrushing, set: setIsBrushing }}
          isErasing={{ val: isErasing, set: setIsErasing }}
          isErasingAlgorithm={{
            val: isErasingAlgorithm,
            set: setIsErasingAlgorithm,
          }}
        />
      </header>
      <main className="flex-auto relative" ref={ref}>
        <Grid
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          droppedObstruction={droppedObstruction}
          isBrushing={isBrushing}
          isErasing={isErasing}
          isErasingAlgorithm={isErasingAlgorithm}
          setIsErasingAlgorithm={setIsErasingAlgorithm}
          rows={Math.max(height, 0)}
          cols={Math.max(width, 0)}
          algorithm={algorithm}
          animationSpeed={animationSpeed}
        />
      </main>
    </div>
  );
};

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

export default App;
