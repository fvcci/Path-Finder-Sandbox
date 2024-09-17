import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import useToolBarContext from "../hooks/useToolBarContext";
import AStar from "@/algorithms/Astar";
import BFS from "@/algorithms/BFS";
import Dijkstra from "@/algorithms/Dijkstra";
import Algorithm from "@/algorithms/Algorithm";

export default function ToolBar() {
  const toolBar = useToolBarContext();

  const algorithms: Algorithm[] = [AStar(), BFS(), Dijkstra()];

  const algorithmIsRunning =
    toolBar.runButton.algorithmEvent === "CLEAR_ALGORITHM";

  return (
    <div className="bg-theme-primary-3 flex flex-row gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="py-1 px-2 bg-red-500"
            onClick={() => {
              toolBar.runButton.notifyObservers("TOGGLE_ALGORITHM_BUTTON");
            }}
          >
            {toolBar.selectedAlgorithm.getName()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-red-500">
          {algorithms.map(
            (algorithm, key) =>
              algorithm.getName() !== toolBar.selectedAlgorithm.getName() && (
                <DropdownMenuItem
                  key={key}
                  onClick={() => toolBar.setSelectedAlgorithm(algorithm)}
                >
                  {algorithm.getName()}
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
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
