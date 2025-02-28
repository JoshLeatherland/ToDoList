import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initialiseI18n } from "./utils/index.js";
import { BrowserRouter } from "react-router-dom";
import { EnvProvider, AuthProvider } from "./contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

initialiseI18n();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/ToDoList">
        <EnvProvider>
          <AuthProvider>
            <div style={{ width: "100vw" }}>
              <App />
            </div>
          </AuthProvider>
        </EnvProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
