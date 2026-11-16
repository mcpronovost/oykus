import "./assets/styles/main.scss";
import { StrictMode, Suspense, createElement, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import OykProviders from "@/components/Providers";
import OykLayout from "@/components/Layout";
import { OykResult } from "@/components/common"
import { OykCoreLoading } from "@/components/core";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { isSpaceFeatureLockedRoute } from "@/utils";

registerSW({ immediate: true });

function OykApp() {
  const { user } = useAuth();
  const { route, n } = useRouter();
  const shouldRedirectToSettings =
    user?.currentSpace?.isActive === false &&
    isSpaceFeatureLockedRoute(route?.name);

  useEffect(() => {
    if (shouldRedirectToSettings) {
      n("settings");
    }
  }, [shouldRedirectToSettings, n]);

  return (
    <OykLayout hidden={!route?.component || ["home", "register", "login", "logout"].includes(route?.name || "")}>
      {shouldRedirectToSettings ? (
        <OykCoreLoading />
      ) : route?.component ? (
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
