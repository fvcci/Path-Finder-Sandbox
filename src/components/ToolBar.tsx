import { useToolBarContext } from "../hooks/useToolBarContext";

export default function ToolBar() {
  const toolBar = useToolBarContext();

  return (
    <div className="bg-primary-3">
      <button
        className="py-1 px-2 bg-red-500"
        onClick={() =>
          toolBar.runButton.notifyObservers("TOGGLE ALGORITHM BUTTON")
        }
      >
        {toolBar.runButton.getAlgorithmEvent()}
      </button>
    </div>
  );
}
