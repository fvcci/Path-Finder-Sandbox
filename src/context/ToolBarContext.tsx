import { ReactNode, createContext, useState } from "react";
import { assert } from "../asserts";

type ObjectValues<T> = T[keyof T];

const OBSTRUCTIONS = {
  WALL: "Wall",
  WEIGHT_1: "Weight 1",
  WEIGHT_2: "Weight 2",
  WEIGHT_3: "Weight 3",
} as const;
type OBSTRUCTION = ObjectValues<typeof OBSTRUCTIONS>;

const TOOL_BAR_TOOLS = {
  OBSTRUCTIONS: "Obstructions",
  ERASERS: "Erasers",
} as const;
type TOOL_BAR_TOOL = ObjectValues<typeof TOOL_BAR_TOOLS>;

interface ToolBarContextType {
  selected: TOOL_BAR_TOOL;
  setSelected: React.Dispatch<React.SetStateAction<TOOL_BAR_TOOL>>;
  mouseTools: {
    obstruction: ReturnType<typeof useMouseTool<OBSTRUCTION>>;
    eraser: ReturnType<typeof useMouseTool<typeof TOOL_BAR_TOOLS.ERASERS>>;
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
  const [selected, setSelected] = useState<TOOL_BAR_TOOL>(
    TOOL_BAR_TOOLS.OBSTRUCTIONS
  );
  const mouseTools = {
    obstruction: useMouseTool<OBSTRUCTION>(Object.values(OBSTRUCTIONS), 2),
    eraser: useMouseTool<typeof TOOL_BAR_TOOLS.ERASERS>(
      [TOOL_BAR_TOOLS.ERASERS],
      2
    ),
  };

  return (
    <ToolBarContext.Provider value={{ selected, setSelected, mouseTools }}>
      {children}
    </ToolBarContext.Provider>
  );
};
