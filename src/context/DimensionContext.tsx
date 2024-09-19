import useToolBarContext from "@/hooks/useToolBarContext";
import {
  ReactNode,
  createContext,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";

export const Provider = ({
  children,
  compression,
  addend,
}: {
  children?: ReactNode | ReactNode[];
  compression: number;
  addend: number;
}) => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const toolBar = useToolBarContext();

  const newRows = Math.max(
    Math.floor(window.innerHeight * compression) + addend,
    2
  );
  const newCols = Math.max(
    Math.floor(window.innerWidth * compression) + addend,
    2
  );
  const handleResize = useCallback(() => {
    if (toolBar.runButton.isDisplayingAlgorithm()) {
      return;
    }

    toolBar.runButton.notifyObservers("CLEAR_ALGORITHM");
    setDimensions({ rows: newRows, cols: newCols });
  }, [toolBar, newRows, newCols]);

  useLayoutEffect(() => {
    if (!dimensions) {
      handleResize();
      return;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dimensions, handleResize]);

  return <Context.Provider value={{ dimensions }}>{children}</Context.Provider>;
};

export const Context = createContext<{
  dimensions: Dimensions | null;
} | null>(null);

export type Dimensions = {
  rows: number;
  cols: number;
};
