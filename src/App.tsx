import ToolBar from "./components/ToolBar";
import Grid from "./components/Grid";
import * as ToolBarContext from "./context/ToolBarContext";
import * as DimensionsContext from "./context/DimensionContext";
import { createRef } from "react";

export default function App() {
  const ref = createRef<HTMLDivElement>();

  return (
    <div className="flex flex-col w-screen h-screen bg-theme-primary-1">
      <ToolBarContext.Provider>
        <header className="flex-initial">
          <ToolBar />
        </header>
        <main className="flex-auto relative" ref={ref}>
          <DimensionsContext.Provider
            compression={1 / 24}
            addend={-6}
            dimensionsRef={ref}
          >
            <Grid />
          </DimensionsContext.Provider>
        </main>
      </ToolBarContext.Provider>
    </div>
  );
}
