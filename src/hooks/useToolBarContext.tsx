import { useContext } from "react";
import { assert } from "../util/asserts";
import * as ToolBarContext from "../context/ToolBarContext";

export default function useToolBarContext() {
  const toolBar = useContext(ToolBarContext.Context);
  assert(toolBar, "useToolBarContext must be used with a ToolBar.Context");
  return toolBar;
}
