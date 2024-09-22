import { ReactNode, createContext, useState } from "react";
import { Observable } from "../hooks/useObserver";
import useRunAlgorithmButton, {
  RunAlgorithmButton,
} from "@/hooks/useRunAlgorithmButton";
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
  runButton: RunAlgorithmButton;
  clearButton: Observable;
} | null>(null);
