export interface Observer {
  update: (event: ObservableEvent) => void;
}

export type Observable = ReturnType<typeof ObservableEditable>;

export const ObservableEditable = () => {
  const observers = new Map<string, Observer>();
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
  | "ABORT_ALGORITHM"
  | "RUN_ALGORITHM"
  | "ALGORITHM_FINISHED_RUNNING";
