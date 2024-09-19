import { ReactNode, createContext, useState } from "react";
import {
  Observable,
  ObservableEditable,
  ObservableEvent,
  Observer,
} from "../util/Observer";
import Algorithm from "../algorithms/Algorithm";
import { Extends } from "../util/types";
import MultiSourceAStar from "@/algorithms/MultiSourceAStar";

export const Provider = ({
  children,
}: {
  children?: ReactNode | ReactNode[];
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    MultiSourceAStar()
  );
  const runButton = useRunAlgorithmButton();

  return (
    <Context.Provider
      value={{
        selectedAlgorithm,
        setSelectedAlgorithm,
        runButton,
        clearButton: ClearAlgorithmButton(),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  selectedAlgorithm: Algorithm;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<Algorithm>>;
  runButton: RunAlgorithmButton;
  clearButton: Observable;
} | null>(null);

const useRunAlgorithmButton = (): RunAlgorithmButton => {
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
    isRunningAlgorithm: () => algorithmEvent === "CLEAR_ALGORITHM",
    algorithmEvent,
  };
};

interface RunAlgorithmButton extends Observable, Observer {
  isRunningAlgorithm: () => boolean;
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
