import { ReactNode, createContext, useState } from "react";
import {
  Observable,
  ObservableEditable,
  ObservableEvent,
} from "../util/observer";
import Algorithm from "../algorithms/Algorithm";
import Dijkstra from "../algorithms/Dijkstra";

export const Provider = ({ children }: { children?: ReactNode[] }) => {
  return (
    <Context.Provider
      value={{
        selectedAlgorithm: Dijkstra(),
        runButton: RunAlgorithmButtonImpl(),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  selectedAlgorithm: Algorithm;
  runButton: RunAlgorithmButton;
} | null>(null);

const RunAlgorithmButtonImpl = (): RunAlgorithmButton => {
  const observable = ObservableEditable();
  const [algorithmEvent, setAlgorithmEvent] = useState<
    ("RUN_ALGORITHM" | "ABORT_ALGORITHM") & ObservableEvent
  >("RUN_ALGORITHM");

  return {
    ...observable,
    notifyObservers: (event: ObservableEvent) => {
      switch (event) {
        case "TOGGLE_ALGORITHM_BUTTON": {
          const originalEvent = algorithmEvent;
          setAlgorithmEvent(
            algorithmEvent === "RUN_ALGORITHM"
              ? "ABORT_ALGORITHM"
              : "RUN_ALGORITHM"
          );
          observable.notifyObservers(originalEvent);
          break;
        }
        case "ALGORITHM_FINISHED_RUNNING":
          setAlgorithmEvent("RUN_ALGORITHM");
          break;
      }
    },
    getAlgorithmEvent: () => algorithmEvent,
  };
};

interface RunAlgorithmButton extends Observable {
  getAlgorithmEvent: () => ObservableEvent;
}
