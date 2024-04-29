import useToolBarContext from "../hooks/useToolBarContext";

export default function ToolBar() {
  const toolBar = useToolBarContext();

  return (
    <div className="bg-theme-primary-3">
      <button
        className="py-1 px-2 bg-red-500"
        onClick={() => {
          toolBar.runButton.notifyObservers("TOGGLE_ALGORITHM_BUTTON");
        }}
      >
        {toolBar.runButton.algorithmEvent}
      </button>
    </div>
  );
}
