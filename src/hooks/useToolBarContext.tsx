import { useContext } from "react";
import { assert } from "../asserts";
import * as ToolBarContext from "../context/ToolBarContext";

export const useToolBarContext = () => {
  const toolBar = useContext(ToolBarContext.Context);
  assert(toolBar, "useToolBarContext must be used with a ToolBar.Context");
  return toolBar;
};
