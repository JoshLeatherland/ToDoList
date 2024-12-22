import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initI18n } from "./utils/index.js";
import en from "./locals/en.json";
import es from "./locals/es.json";

initI18n({
  en,
  es,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div style={{ width: "100vw" }}>
      <App />
    </div>
  </StrictMode>
);
