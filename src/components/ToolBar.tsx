import { ReactNode, createContext, useContext, useState } from "react";
import { Observable, IObservable } from "../observer";

// run button

export default function ToolBar() {
  const toolBar = useContext(Context);
  return (
    <div className="bg-primary-3">
      <button></button>
    </div>
  );
}

export const Context = createContext<{
  runButton: IObservable;
} | null>(null);

export const ContextProvider = ({ children }: { children?: ReactNode[] }) => {
  return (
    <Context.Provider value={{ runButton: RunButton() }}>
      {children}
    </Context.Provider>
  );
};

const RunButton = (): IObservable => {
  const observable = Observable();
  const [runAlgorithmEvent, setRunAlgorithmEvent] =
    useState<RunAlgorithmEvent>("ABORT ALGORITHM");

  return {
    ...observable,
    notifyObservers: (unverifiedEvent: string) => {
      const event = unverifiedEvent as "onClick";
      switch (event) {
        case "onClick":
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

type RunAlgorithmEvent = "RUN ALGORITHM" | "ABORT ALGORITHM";
