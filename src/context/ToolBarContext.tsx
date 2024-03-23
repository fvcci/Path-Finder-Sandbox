import { ReactNode, createContext, useState } from "react";
import { assert } from "../asserts";
import { ObjectValues } from "../type_helpers";

const GRAPH_MODIFIER = {
  OBSTRUCTION: "Obstruction",
  ERASER: "Eraser",
} as const;
export type GraphModifier = ObjectValues<typeof GRAPH_MODIFIER>;

const OBSTRUCTION = {
  WALL: "Wall",
  WEIGHT_1: "Weight 1",
  WEIGHT_2: "Weight 2",
  WEIGHT_3: "Weight 3",
} as const;
export type Obstruction = ObjectValues<typeof OBSTRUCTION>;

interface ToolBarContextType {
  selected: GraphModifier;
  setSelected: React.Dispatch<React.SetStateAction<GraphModifier>>;
  // graphModifiers: {
  //   obstruction: ReturnType<typeof useGraphModifier<Obstruction>>;
  //   eraser: ReturnType<typeof useGraphModifier<typeof GRAPH_MODIFIER.ERASER>>;
  // };
}
export const ToolBarContext = createContext<ToolBarContextType | null>(null);

export const ToolBarContextProvider = ({
  children,
}: {
  children?: ReactNode[];
}) => {
  const [selected, setSelected] = useState<GraphModifier>(
    GRAPH_MODIFIER.OBSTRUCTION
  );

  const graphModifiers = new Map<
    GraphModifier,
    | ReturnType<typeof useGraphModifier<Obstruction>>
    | ReturnType<typeof useGraphModifier<typeof GRAPH_MODIFIER.ERASER>>
  >();
  graphModifiers.set(
    GRAPH_MODIFIER.OBSTRUCTION,
    useGraphModifier<Obstruction>(Object.values(OBSTRUCTION), 2)
  );
  graphModifiers.set(
    GRAPH_MODIFIER.ERASER,
    useGraphModifier<typeof GRAPH_MODIFIER.ERASER>([GRAPH_MODIFIER.ERASER], 2)
  );
  // const graphModifier = {
  //   selected,
  //   setSelected,
  //   get: () => graphModifiers[selected],
  // };

  return (
    <ToolBarContext.Provider value={{ selected, setSelected }}>
      {children}
    </ToolBarContext.Provider>
  );
};

const useGraphModifier = <T,>(tools: T[], sizeLimitExclusive: number) => {
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
