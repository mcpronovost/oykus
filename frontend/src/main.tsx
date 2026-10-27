import "./assets/styles/main.scss";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import OykProviders from "@/components/Providers";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";

const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

registerSW({ immediate: true });

function OykApp() {
  const { route } = useRouter();
  const { isAuth } = useAuth();

  if (!route) {
    return null;
  }

  let Page = route.component;

  if (route.name === "home") {
    Page = isAuth ? Dashboard : Home;
  }

  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
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
