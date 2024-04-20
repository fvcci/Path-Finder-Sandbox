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
    enlist: (observer: Observer) => {
      observers.add(observer);
    },
  };
};

export type ObservableEvent = [
  "RUN ALGORITHM BUTTON CLICK",
  "RUN ALGORITHM",
  "ABORT ALGORITHM"
][number];
