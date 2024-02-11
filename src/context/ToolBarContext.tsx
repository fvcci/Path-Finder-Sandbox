import { ReactNode, createContext, useState } from "react";
import { assert } from "../asserts";

const OBSTRUCTIONS = ["Wall", "Weight 1", "Weight 2", "Weight 3"];
type OBSTRUCTION = (typeof OBSTRUCTIONS)[number];

const TOOL_BAR_TOOLS = ["Obstructions", "Eraser"];
type TOOL_BAR_TOOL = (typeof TOOL_BAR_TOOLS)[number];

interface ToolBarContextType {
  tool: TOOL_BAR_TOOL;
  setTool: React.Dispatch<React.SetStateAction<TOOL_BAR_TOOL>>;
  mouseTools: {
    obstruction: ReturnType<typeof useMouseTool<OBSTRUCTION>>;
    eraser: ReturnType<typeof useMouseTool<TOOL_BAR_TOOL>>;
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

export const ToolBarContext = createContext<ToolBarContextType | undefined>(
  undefined
);

export const ToolBarContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tool, setTool] = useState<TOOL_BAR_TOOL>("Obstructions");
  const mouseTools = {
    obstruction: useMouseTool<OBSTRUCTION>(OBSTRUCTIONS, 2),
    eraser: useMouseTool<TOOL_BAR_TOOL>(["Eraser"], 2),
  };

  return (
    <ToolBarContext.Provider value={{ tool, setTool, mouseTools }}>
      {children}
    </ToolBarContext.Provider>
  );
};
