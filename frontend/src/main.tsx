import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OykApp } from "./App.tsx";
import { OykProviders } from "./components/index.js";
import "./assets/styles/main.scss";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The root element is missing.");
}

createRoot(root).render(
  <StrictMode>
    <OykProviders>
      <OykApp />
    </OykProviders>
  </StrictMode>,
);
