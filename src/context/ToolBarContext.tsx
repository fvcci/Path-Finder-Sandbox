import { ReactNode, createContext, useState } from "react";
import useRunAlgorithmButton from "@/hooks/useRunAlgorithmButton";
import useClearAlgorithmButton from "@/hooks/useClearAlgorithmButton";
import { Algorithm, ALGORITHMS } from "@/algorithms";

export const Provider = ({
  children,
}: {
  children?: ReactNode | ReactNode[];
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0]);
  const runButton = useRunAlgorithmButton();
  const clearButton = useClearAlgorithmButton();

  return (
    <Context.Provider
      value={{
        selectedAlgorithm,
        setSelectedAlgorithm,
        runButton,
        clearButton,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  selectedAlgorithm: Algorithm;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<Algorithm>>;
  runButton: ReturnType<typeof useRunAlgorithmButton>;
  clearButton: ReturnType<typeof useClearAlgorithmButton>;
} | null>(null);
