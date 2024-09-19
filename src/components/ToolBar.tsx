import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import useToolBarContext from "../hooks/useToolBarContext";
import AStar from "@/algorithms/AStar";
import BFS from "@/algorithms/BFS";
import Dijkstra from "@/algorithms/Dijkstra";
import Algorithm from "@/algorithms/Algorithm";
import DFS from "@/algorithms/DFS";
import MultiSourceBFS from "@/algorithms/MultiSourceBFS";
import MultiSourceAStar from "@/algorithms/MultiSourceAStar";

export default function ToolBar() {
  const toolBar = useToolBarContext();

  const algorithms: Algorithm[] = [
    AStar(),
    DFS(),
    BFS(),
    Dijkstra(),
    MultiSourceBFS(),
    MultiSourceAStar(),
  ];

  return (
    <div className="bg-theme-primary-3 flex flex-row gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="py-1 px-2 bg-red-500 flex flex-col w-64"
            onClick={() => {
              toolBar.runButton.notifyObservers("TOGGLE_ALGORITHM_BUTTON");
            }}
          >
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
        {toolBar.runButton.getAlgorithmEvent() == "CLEAR_ALGORITHM"
          ? "ABORT_ALGORITHM"
          : "RUN_ALGORITHM"}
      </button>
      <button
        className="py-1 px-2 bg-red-500 disabled:opacity-50"
        disabled={toolBar.runButton.isRunningAlgorithm()}
        onClick={() => {
          toolBar.clearButton.notifyObservers("CLEAR_ALGORITHM");
        }}
      >
        CLEAR_ALGORITHM
      </button>
    </div>
  );
}
