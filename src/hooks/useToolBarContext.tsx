import { useContext } from "react";
import * as ToolBarContext from "../context/ToolBarContext";
import assert from "assert";

export default function useToolBarContext() {
  const toolBar = useContext(ToolBarContext.Context);
  assert(toolBar, "useToolBarContext must be used with a ToolBar.Context");
  return toolBar;
}
