export interface Observer {
  update: (event: string) => void;
}

export type IObservable = ReturnType<typeof Observable>;

export const Observable = () => {
  const observers = new Set<Observer>([]);
  return {
    notifyObservers: (unverifiedEvent: string) => {
      observers.forEach((observer) => observer.update(unverifiedEvent));
    },
    enlist: (observer: Observer) => {
      observers.add(observer);
    },
  };
};
