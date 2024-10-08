import ToolBar from "./components/ToolBar";
import Grid from "./components/Grid";
import * as ToolBarContext from "./context/ToolBarContext";
import * as DimensionsContext from "./context/DimensionContext";

export default function App() {
  return (
    <div className="flex flex-col w-screen h-screen bg-theme-primary-1">
      <ToolBarContext.Provider>
        <header className="flex-initial z-10">
          <ToolBar />
        </header>
        <main className="flex-auto relative">
          <DimensionsContext.Provider compression={1 / 24} addend={-6}>
            <Grid />
          </DimensionsContext.Provider>
        </main>
      </ToolBarContext.Provider>
    </div>
  );
}
