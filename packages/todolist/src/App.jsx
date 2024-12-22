import { theme, ToDoApp } from "./components";
import { ThemeProvider } from "@emotion/react";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToDoApp />
    </ThemeProvider>
  );
}

export default App;
