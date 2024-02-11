import React, { useState, useLayoutEffect, createRef } from "react";

// local imports
import ToolBar from "./ToolBar";
import Grid from "./Grid";
import AStar from "../algorithms/Astar";
import { GRID_PADDING, NODE_SIZE, SM } from "../constants";

// Find the dimensions of a div element
const useRefDimensions = (ref: React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) {
      console.error("ref.current is null");
      return;
    }
    if (dimensions.width !== 0 && dimensions.height !== 0) {
      return;
    }

    const { width, height } = ref.current.getBoundingClientRect();
    setDimensions({ width: Math.round(width), height: Math.round(height) });
  }, [dimensions, ref]);

  return dimensions;
};

const PathFindingVisualizer: React.FC = () => {
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
  const { width: contentWidth, height: contentHeight } = useRefDimensions(ref);

  return (
    <div className="flex flex-col h-full">
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
      <div className="flex-auto relative" ref={ref}>
        <Grid
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          droppedObstruction={droppedObstruction}
          isBrushing={isBrushing}
          isErasing={isErasing}
          isErasingAlgorithm={isErasingAlgorithm}
          setIsErasingAlgorithm={setIsErasingAlgorithm}
          // scuffed responsive layout
          rows={
            contentHeight
              ? Math.floor(contentHeight / NODE_SIZE) -
                (contentWidth >= SM ? GRID_PADDING.ROW : GRID_PADDING.ROW_SM)
              : 0
          }
          cols={
            contentWidth
              ? Math.floor(contentWidth / NODE_SIZE) -
                (contentWidth >= SM ? GRID_PADDING.COL : GRID_PADDING.COL_SM)
              : 0
          }
          algorithm={algorithm}
          animationSpeed={animationSpeed}
        />
      </div>
    </div>
  );
};

export default PathFindingVisualizer;
