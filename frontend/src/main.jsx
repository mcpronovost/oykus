import "@/assets/styles/main.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

function Root() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

const oykRoot = document.getElementById("oykus");
if (oykRoot) {
  createRoot(oykRoot).render(<Root />);
}
