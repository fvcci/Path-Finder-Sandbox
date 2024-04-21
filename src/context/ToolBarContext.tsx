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
        runButton: RunAlgorithmButton(),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  selectedAlgorithm: Algorithm;
  runButton: ReturnType<typeof RunAlgorithmButton>;
} | null>(null);

const RunAlgorithmButton = (): Observable & {
  getAlgorithmEvent: () => ObservableEvent;
} => {
  const observable = ObservableEditable();
  const [algorithmEvent, setAlgorithmEvent] = useState<
    ("RUN ALGORITHM" | "ABORT ALGORITHM") & ObservableEvent
  >("RUN ALGORITHM");

  return {
    ...observable,
    notifyObservers: (event: ObservableEvent) => {
      switch (event) {
        case "TOGGLE ALGORITHM BUTTON": {
          const originalEvent = algorithmEvent;
          setAlgorithmEvent(
            algorithmEvent === "RUN ALGORITHM"
              ? "ABORT ALGORITHM"
              : "RUN ALGORITHM"
          );
          observable.notifyObservers(originalEvent);
          break;
        }
        case "ALGORITHM FINISHED RUNNING":
          setAlgorithmEvent("RUN ALGORITHM");
          break;
      }
    },
    getAlgorithmEvent: () => algorithmEvent,
  };
};
