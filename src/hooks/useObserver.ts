import { useState } from "react";

export interface Observer {
  update: (event: ObservableEvent) => void;
}

export type Observable = ReturnType<typeof useObservable>;

export const useObservable = () => {
  const [observers] = useState(new Map<string, Observer>());
  return {
    notifyObservers: (event: ObservableEvent) => {
      observers.forEach((observer) => observer.update(event));
    },
    enlistToNotify: (name: string, observer: Observer) => {
      observers.set(name, observer);
    },
  };
};

export type ObservableEvent =
  | "TOGGLE_ALGORITHM_BUTTON"
  | "CLEAR_ALGORITHM"
  | "RUN_ALGORITHM"
  | "ALGORITHM_FINISHED_RUNNING";
