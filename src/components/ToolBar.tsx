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
import DFS from "@/algorithms/DFS";
import MultiSourceBFS from "@/algorithms/MultiSourceBFS";

export default function ToolBar() {
  const toolBar = useToolBarContext();

  const algorithms: Algorithm[] = [
    AStar(),
    DFS(),
    BFS(),
    Dijkstra(),
    MultiSourceBFS(),
  ];

  const algorithmIsRunning =
    toolBar.runButton.algorithmEvent === "CLEAR_ALGORITHM";

  const AlgorithmDropdownWidthAdjuster = () => (
    <>
      {algorithms.map((algorithm, key) => (
        <div key={key} className="text-transparent h-0">
          {algorithm.getName()}
        </div>
      ))}
    </>
  );

  return (
    <div className="bg-theme-primary-3 flex flex-row gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="py-1 px-2 bg-red-500 flex flex-col"
            onClick={() => {
              toolBar.runButton.notifyObservers("TOGGLE_ALGORITHM_BUTTON");
            }}
          >
            <AlgorithmDropdownWidthAdjuster />
            {toolBar.selectedAlgorithm.getName()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-1 bg-red-500">
          {algorithms.map(
            (algorithm, key) =>
              algorithm.getName() !== toolBar.selectedAlgorithm.getName() && (
                <DropdownMenuItem
                  className="px-1"
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
