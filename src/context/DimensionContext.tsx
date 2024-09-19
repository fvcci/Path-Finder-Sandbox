import useToolBarContext from "@/hooks/useToolBarContext";
import { ReactNode, createContext, useLayoutEffect, useState } from "react";

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

  useLayoutEffect(() => {
    const handleResize = () => {
      if (
        toolBar.runButton.isRunningAlgorithm() ||
        !window.innerWidth ||
        !window.innerHeight
      ) {
        return;
      }

      const newDimensions = {
        rows: Math.max(
          Math.floor(window.innerHeight * compression) + addend,
          2
        ),
        cols: Math.max(Math.floor(window.innerWidth * compression) + addend, 2),
      };
      setDimensions(newDimensions);
    };

    if (!dimensions) {
      handleResize();
      return;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toolBar, dimensions, addend, compression]);

  return <Context.Provider value={{ dimensions }}>{children}</Context.Provider>;
};

export const Context = createContext<{
  dimensions: Dimensions | null;
} | null>(null);

export type Dimensions = {
  rows: number;
  cols: number;
};
