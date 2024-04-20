import { ReactNode, createContext, useState } from "react";
import { Observable, ObservableEditable, ObservableEvent } from "../observer";

export const Provider = ({ children }: { children?: ReactNode[] }) => {
  return (
    <Context.Provider value={{ runButton: RunAlgorithmButton() }}>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  runButton: Observable;
} | null>(null);

const RunAlgorithmButton = (): Observable => {
  const observable = ObservableEditable();
  const [runAlgorithmEvent, setRunAlgorithmEvent] = useState<
    ("RUN ALGORITHM" | "ABORT ALGORITHM") & ObservableEvent
  >("ABORT ALGORITHM");

  return {
    ...observable,
    notifyObservers: (event: ObservableEvent) => {
      switch (event) {
        case "RUN ALGORITHM BUTTON CLICK":
          observable.notifyObservers(runAlgorithmEvent);
          setRunAlgorithmEvent(
            runAlgorithmEvent === "RUN ALGORITHM"
              ? "ABORT ALGORITHM"
              : "RUN ALGORITHM"
          );
          break;
      }
    },
  };
};
