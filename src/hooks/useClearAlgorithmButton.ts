import {
  Observable,
  useObservable,
  ObservableEvent,
} from "../hooks/useObserver";

export default function useClearAlgorithmButton(): Observable {
  const observable = useObservable();

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
}
