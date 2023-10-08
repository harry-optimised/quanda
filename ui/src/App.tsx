import "./App.css";
import React from "react";
import "reactflow/dist/style.css";
import theme from "./theme";
import { ThemeProvider } from "evergreen-ui";
import Flow from "./components/Flow";
import BottomBar from "./components/BottomBar";

function App() {
  return (
    <ThemeProvider value={theme}>
      <div className="App" style={{ width: "100%", height: "100vh" }}>
        <Flow primary={4} />
        <BottomBar />
      </div>
    </ThemeProvider>
  );
}

export default App;
