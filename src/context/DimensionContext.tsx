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

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!window.innerWidth) {
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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("reisze", handleResize);
  }, [addend, compression]);

  return <Context.Provider value={{ dimensions }}>{children}</Context.Provider>;
};

export const Context = createContext<{
  dimensions: Dimensions | null;
} | null>(null);

export type Dimensions = {
  rows: number;
  cols: number;
};
