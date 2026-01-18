import { createElement, Suspense } from "react";
import { useRouter } from "@/services/router";
import Providers from "@/components/Providers";
import OykAppHeader from "@/components/core/AppHeader";
import OykAppSidebar from "@/components/core/AppSidebar";
import OykAppLoading from "@/components/core/AppLoading";
import OykAppNotFound from "@/components/core/AppNotFound";

function MainLayout() {
  const { route } = useRouter();

  return (
    <main id="oyk-app-main">
      {route && route.component ? (
        <Suspense fallback={<OykAppLoading />}>
          {createElement(route.component)}
        </Suspense>
      ) : (
        <OykAppNotFound />
      )}
    </main>
  );
}

function Layout() {
  return (
    <div id="oyk-app">
      <OykAppSidebar />
      <div id="oyk-app-core">
        <OykAppHeader />
        <MainLayout />
      </div>
    </div>
  );
}

function App() {
  return (
    <Providers>
      <Layout />
    </Providers>
  );
}

export default App;
