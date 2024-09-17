import { ReactNode, createContext, useState } from "react";
import {
  Observable,
  ObservableEditable,
  ObservableEvent,
  Observer,
} from "../util/Observer";
import Algorithm from "../algorithms/Algorithm";
import Dijkstra from "../algorithms/Dijkstra";
import { Extends } from "../util/types";
import AStar from "../algorithms/Astar";

export const Provider = ({
  children,
}: {
  children?: ReactNode | ReactNode[];
}) => {
  return (
    <Context.Provider
      value={{
        selectedAlgorithm: AStar(),
        runButton: RunAlgorithmButton(),
        clearButton: ClearAlgorithmButton(),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  selectedAlgorithm: Algorithm;
  runButton: RunAlgorithmButton;
  clearButton: Observable;
} | null>(null);

const RunAlgorithmButton = (): RunAlgorithmButton => {
  const observable = ObservableEditable();
  const [algorithmEvent, setAlgorithmEvent] =
    useState<Extends<ObservableEvent, "RUN_ALGORITHM" | "CLEAR_ALGORITHM">>(
      "RUN_ALGORITHM"
    );

  return {
    ...observable,
    notifyObservers: (event: ObservableEvent) => {
      switch (event) {
        case "TOGGLE_ALGORITHM_BUTTON": {
          const originalEvent = algorithmEvent;
          setAlgorithmEvent(
            algorithmEvent === "RUN_ALGORITHM"
              ? "CLEAR_ALGORITHM"
              : "RUN_ALGORITHM"
          );
          observable.notifyObservers(originalEvent);
          break;
        }
        case "CLEAR_ALGORITHM": {
          observable.notifyObservers("CLEAR_ALGORITHM");
          setAlgorithmEvent("RUN_ALGORITHM");
          break;
        }
        case "ALGORITHM_FINISHED_RUNNING":
          setAlgorithmEvent("RUN_ALGORITHM");
          break;
      }
    },
    update: (event: ObservableEvent) => {
      switch (event) {
        case "CLEAR_ALGORITHM":
          setAlgorithmEvent("RUN_ALGORITHM");
          break;
      }
    },
    algorithmEvent,
  };
};

interface RunAlgorithmButton extends Observable, Observer {
  algorithmEvent: ObservableEvent;
}

const ClearAlgorithmButton = (): Observable => {
  const observable = ObservableEditable();

  return {
    ...observable,
    notifyObservers: (event: ObservableEvent) => {
      switch (event) {
        case "CLEAR_ALGORITHM": {
          observable.notifyObservers("CLEAR_ALGORITHM");
          break;
        }
      }
    },
  };
};
