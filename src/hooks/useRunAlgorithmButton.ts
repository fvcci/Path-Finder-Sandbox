import { useState } from "react";
import {
  Observable,
  useObservable,
  ObservableEvent,
  Observer,
} from "../hooks/useObserver";
import { Extends } from "../lib/types";

export interface RunAlgorithmButton extends Observable, Observer {
  isRunningAlgorithm: () => boolean;
  isDisplayingAlgorithm: () => boolean;
  getAlgorithmEvent: () => ObservableEvent;
}

export default function useRunAlgorithmButton(): RunAlgorithmButton {
  const observable = useObservable();
  const [algorithmEvent, setAlgorithmEvent] =
    useState<Extends<ObservableEvent, "RUN_ALGORITHM" | "CLEAR_ALGORITHM">>(
      "RUN_ALGORITHM"
    );
  const [displaysAlgorithm, setDisplaysAlgorithm] = useState(false);

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
          setDisplaysAlgorithm(originalEvent === "RUN_ALGORITHM");
          observable.notifyObservers(originalEvent);
          break;
        }
        case "CLEAR_ALGORITHM": {
          observable.notifyObservers("CLEAR_ALGORITHM");
          setAlgorithmEvent("RUN_ALGORITHM");
          setDisplaysAlgorithm(false);
          break;
        }
        case "ALGORITHM_FINISHED_RUNNING":
          setAlgorithmEvent("RUN_ALGORITHM");
          break;
      }
    },
    update: (event: ObservableEvent) => {
      switch (event) {
        case "CLEAR_ALGORITHM": {
          setAlgorithmEvent("RUN_ALGORITHM");
          setDisplaysAlgorithm(false);
          break;
        }
      }
    },
    isRunningAlgorithm: () => algorithmEvent === "CLEAR_ALGORITHM",
    isDisplayingAlgorithm: () => displaysAlgorithm,
    getAlgorithmEvent: () => algorithmEvent,
  };
}
