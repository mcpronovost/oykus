import "./assets/styles/main.scss";
import { StrictMode, Suspense, createElement } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import OykProviders from "@/components/Providers";
import OykLayout from "@/components/Layout";
import { OykResult } from "@/components/common"
import { OykCoreLoading } from "@/components/core";
import { useRouter } from "@/services/router";

registerSW({ immediate: true });

function OykApp() {
  const { route } = useRouter();

  return (
    <OykLayout hidden={["home", "register", "login", "logout"].includes(route?.name || "")}>
      {route?.component ? (
        <Suspense fallback={<OykCoreLoading />}>
          {createElement(route.component)}
        </Suspense>
      ) : (
        <OykResult title="404" />
      )}
    </OykLayout>
  );
}

function OykRoot() {
  return (
    <StrictMode>
      <OykProviders>
        <OykApp />
      </OykProviders>
    </StrictMode>
  );
}

const root = document.getElementById("oykus");

if (!root) {
  throw new Error("The root element is missing.");
}

createRoot(root).render(<OykRoot />);
