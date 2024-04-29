import { ReactNode, createContext, useLayoutEffect, useState } from "react";

export const Provider = ({
  children,
  compression,
  dimensionsRef,
  addend,
}: {
  children?: ReactNode | ReactNode[];
  dimensionsRef?: React.RefObject<HTMLDivElement> | null;
  compression: number;
  addend: number;
}) => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  useLayoutEffect(() => {
    if (!dimensionsRef?.current) {
      return;
    }

    if (dimensions) {
      return;
    }

    const { width, height } = dimensionsRef.current.getBoundingClientRect();
    const newDimensions = {
      rows: Math.max(Math.floor(height * compression) + addend, 2),
      cols: Math.max(Math.floor(width * compression) + addend, 2),
    };
    setDimensions(newDimensions);
  }, [dimensionsRef, dimensions, compression, addend]);

  return (
    <Context.Provider value={{ dimensions, setDimensions }}>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  dimensions: Dimensions | null;
  setDimensions: React.Dispatch<React.SetStateAction<Dimensions | null>>;
} | null>(null);

export type Dimensions = {
  rows: number;
  cols: number;
};
