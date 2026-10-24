import "./assets/styles/main.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OykApp from "./App";
import OykProviders from "./components/Providers";

const root = document.getElementById("oykus");

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
