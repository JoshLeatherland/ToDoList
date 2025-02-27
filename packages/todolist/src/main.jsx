import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initialiseI18n } from "./utils/index.js";
import { BrowserRouter } from "react-router-dom";

initialiseI18n();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/ToDoList">
      <div style={{ width: "100vw" }}>
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
