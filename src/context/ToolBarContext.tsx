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
      value={{ selectedAlgorithm: Dijkstra(), runButton: RunAlgorithmButton() }}
    >
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  selectedAlgorithm: Algorithm;
  runButton: Observable;
} | null>(null);

const RunAlgorithmButton = (): Observable => {
  const observable = ObservableEditable();
  const [runAlgorithmEvent, setRunAlgorithmEvent] = useState<
    ("RUN ALGORITHM" | "ABORT ALGORITHM") & ObservableEvent
  >("ABORT ALGORITHM");

  return {
    ...observable,
    notifyObservers: (event: ObservableEvent) => {
      switch (event) {
        case "RUN ALGORITHM BUTTON CLICK":
          observable.notifyObservers(runAlgorithmEvent);
          setRunAlgorithmEvent(
            runAlgorithmEvent === "RUN ALGORITHM"
              ? "ABORT ALGORITHM"
              : "RUN ALGORITHM"
          );
          break;
      }
    },
  };
};
