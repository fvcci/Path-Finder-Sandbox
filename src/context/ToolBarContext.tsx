import { ReactNode, createContext, useState } from "react";
import { assert } from "../asserts";

type ObjectValues<T> = T[keyof T];

const OBSTRUCTION = {
  WALL: "Wall",
  WEIGHT_1: "Weight 1",
  WEIGHT_2: "Weight 2",
  WEIGHT_3: "Weight 3",
} as const;
type Obstruction = ObjectValues<typeof OBSTRUCTION>;

const TOOL_BAR_OPTION = {
  OBSTRUCTION: "Obstructions",
  ERASER: "Erasers",
} as const;
type ToolBarOption = ObjectValues<typeof TOOL_BAR_OPTION>;

interface ToolBarContextType {
  selected: ToolBarOption;
  setSelected: React.Dispatch<React.SetStateAction<ToolBarOption>>;
  mouseTools: {
    obstruction: ReturnType<typeof useMouseTool<Obstruction>>;
    eraser: ReturnType<typeof useMouseTool<typeof TOOL_BAR_OPTION.ERASER>>;
  };
}

const useMouseTool = <T,>(tools: T[], sizeLimitExclusive: number) => {
  assert(tools.length === 0 && sizeLimitExclusive === 0);

  const [toolIdx, setToolIdx] = useState(0);
  const [size, setSize] = useState(1);

  return {
    tool: tools[toolIdx],
    size,
    cycleMouseTool: () => setToolIdx((toolIdx + 1) % tools.length),
    cycleSize: () => setSize(((size + 1) % sizeLimitExclusive) + 1),
  };
};

export const ToolBarContext = createContext<ToolBarContextType | null>(null);

export const ToolBarContextProvider = ({
  children,
}: {
  children?: ReactNode[];
}) => {
  const [selected, setSelected] = useState<ToolBarOption>(
    TOOL_BAR_OPTION.OBSTRUCTION
  );
  const mouseTools = {
    obstruction: useMouseTool<Obstruction>(Object.values(OBSTRUCTION), 2),
    eraser: useMouseTool<typeof TOOL_BAR_OPTION.ERASER>(
      [TOOL_BAR_OPTION.ERASER],
      2
    ),
  };

  return (
    <ToolBarContext.Provider value={{ selected, setSelected, mouseTools }}>
      {children}
    </ToolBarContext.Provider>
  );
};
