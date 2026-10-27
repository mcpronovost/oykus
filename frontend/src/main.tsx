import "./assets/styles/main.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import OykApp from "./App";
import OykProviders from "./components/Providers";

registerSW({ immediate: true });

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
