import { FC } from "react";

interface State<T> {
  val: T;
  set: (val: T) => void;
}

interface ToolBarProps {
  runButton: State<boolean>;
  isErasingAlgorithm: State<boolean>;
}

const ToolBar: FC<ToolBarProps> = ({ runButton, isErasingAlgorithm }) => {
  const playButtonText = runButton.val ? "ABORT" : "PLAY";
  const isErasingAlgorithmText = "ERASE ALGORITHM";

  // When selecting eraser, deslect everything else
  // When selecting something else, deselect eraser
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    <div className="bg-dark-blue">
      <button onClick={() => runButton.set(!runButton.val)}>
        {playButtonText}
      </button>
      <button onClick={() => isErasingAlgorithm.set(true)}>
        {isErasingAlgorithmText}
      </button>
    </div>
  );
};

export default ToolBar;
