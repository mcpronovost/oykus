import { createElement, Suspense, useEffect, useMemo } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useWorld } from "@/services/world";

import { OykScrollbar } from "@/components/ui";

import Providers from "@/components/Providers";
import OykCoreTopbar from "@/components/core/Topbar";
import OykCoreNavbar from "@/components/core/Navbar";
import OykCoreGamebar from "@/components/core/Gamebar";
import OykCoreSidebar from "@/components/core/Sidebar";
import OykCoreFooter from "@/components/core/Footer";
import OykAppLoading from "@/components/core/AppLoading";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";
import OykAppNotFound from "@/components/core/AppNotFound";

function MainLayout() {
  const { isLoadingAuth, isAuth, isDev } = useAuth();
  const { route, params } = useRouter();
  const { currentUniverse, changeUniverse } = useWorld();

  useEffect(() => {
    if (params?.universeSlug && currentUniverse && params?.universeSlug !== currentUniverse.slug) {
      changeUniverse(params.universeSlug);
    } else if (!currentUniverse || (currentUniverse.slug !== "oykus" && route?.name === "home")) {
      changeUniverse("oykus");
    }
  }, [route, params]);

  return (
    <main id="oyk-main">
      {route && route.component && !isLoadingAuth ? (
        <Suspense fallback={<OykAppLoading />}>
          <OykScrollbar isMainScroll height={"100%"}>
            <>
              {(route.require_auth && !isAuth) || (route.require_dev && !isDev) ? (
                <OykAppNotAuthorized />
              ) : (
                createElement(route.component)
              )}
              <OykCoreFooter />
            </>
          </OykScrollbar>
        </Suspense>
      ) : isLoadingAuth ? (
        <OykAppLoading />
      ) : (
        <OykAppNotFound />
      )}
    </main>
  );
}

function Layout() {
  const { route } = useRouter();
  const { currentUniverse } = useWorld();

  const isGameMode = useMemo(
    () =>
      currentUniverse &&
      !currentUniverse.is_default &&
      (route.name === "universe" || route.name.startsWith("universe-game")),
      // route.name !== "universe" &&
      // !route.name.startsWith("universe-admin") &&
      // !route.name.startsWith("settings"),
    [currentUniverse, route.name],
  );

  return (
    <div id="oyk-app">
      <OykCoreTopbar isGameMode={isGameMode} />
      <div id="oyk-core">
        <OykCoreNavbar isGameMode={isGameMode} />
        {isGameMode ? <OykCoreGamebar isGameMode={isGameMode} /> : null}
        <MainLayout />
        <OykCoreSidebar isGameMode={isGameMode} />
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
