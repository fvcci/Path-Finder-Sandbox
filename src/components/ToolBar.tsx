import { FC } from "react";

interface State<T> {
  val: T;
  set: (val: T) => void;
}

interface ToolBarProps {
  runButton: State<boolean>;
  droppedObstruction: State<number>;
  isBrushing: State<boolean>;
  isErasing: State<boolean>;
  isErasingAlgorithm: State<boolean>;
}

const ToolBar: FC<ToolBarProps> = ({
  runButton,
  droppedObstruction,
  isBrushing,
  isErasing,
  isErasingAlgorithm,
}) => {
  const playButtonText = runButton.val ? "ABORT" : "PLAY";
  const isBrushingText = isBrushing.val ? "BIG BRUSH" : "SMALL BRUSH";
  const droppedObstructionText =
    droppedObstruction.val == 0 ? "WALLS"
      : droppedObstruction.val == 1 ? "WEIGHT 1"
        : droppedObstruction.val == 2 ? "WEIGHT 2"
          : "WEIGHT 3";
  const isErasingText = isErasing.val ? "BIG ERASER" : "SMALL ERASER";
  const isErasingAlgorithmText = "ERASE ALGORITHM";

  // When selecting eraser, deslect everything else
  // When selecting something else, deselect eraser
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const selectTool = (tool: State<any>) => {
    if (tool == isErasing) {
      isErasing.set(!isErasing.val);
      isBrushing.set(false);
    } else if (tool == isBrushing) {
      isErasing.set(false);
      isBrushing.set(!isBrushing.val);
    } else if (tool == droppedObstruction) {
      isErasing.set(false);
      droppedObstruction.set((droppedObstruction.val+1)%4);
    }
  }

  return (
    <div className="bg-dark-blue">
      <button onClick={() => runButton.set(!runButton.val)}>{playButtonText}</button>
      <button onClick={() => selectTool(isBrushing)}>{isBrushingText}</button>
      {/* make a button to add weighted nodes */}
      <button onClick={() => selectTool(droppedObstruction)}>{droppedObstructionText}</button>
      <button onClick={() => selectTool(isErasing)}>{isErasingText}</button>
      <button onClick={() => isErasingAlgorithm.set(true)}>{isErasingAlgorithmText}</button>
    </div>
  );
};

export default ToolBar;
