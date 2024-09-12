import useToolBarContext from "../hooks/useToolBarContext";

export default function ToolBar() {
  const toolBar = useToolBarContext();

  const algorithmIsRunning =
    toolBar.runButton.algorithmEvent === "CLEAR_ALGORITHM";

  return (
    <div className="bg-theme-primary-3 flex flex-row gap-x-2">
      <button
        className="py-1 px-2 bg-red-500"
        onClick={() => {
          toolBar.runButton.notifyObservers("TOGGLE_ALGORITHM_BUTTON");
        }}
      >
        {toolBar.runButton.algorithmEvent == "CLEAR_ALGORITHM"
          ? "ABORT_ALGORITHM"
          : "RUN_ALGORITHM"}
      </button>
      <button
        className="py-1 px-2 bg-red-500 disabled:opacity-50"
        disabled={algorithmIsRunning}
        onClick={() => {
          toolBar.clearButton.notifyObservers("CLEAR_ALGORITHM");
        }}
      >
        CLEAR_ALGORITHM
      </button>
    </div>
  );
}
