export interface Observer {
  update: (event: ObservableEvent) => void;
}

export type Observable = ReturnType<typeof ObservableEditable>;

export const ObservableEditable = () => {
  const observers = new Set<Observer>([]);
  return {
    notifyObservers: (event: ObservableEvent) => {
      observers.forEach((observer) => observer.update(event));
    },
    enlistToNotify: (observer: Observer) => {
      observers.add(observer);
    },
  };
};

export type ObservableEvent = [
  "TOGGLE ALGORITHM BUTTON",
  "RUN ALGORITHM",
  "ABORT ALGORITHM",
  "ALGORITHM FINISHED RUNNING"
][number];
