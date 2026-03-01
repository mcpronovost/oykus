import { createElement, Suspense, useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useWorld } from "@/services/world";

import { OykScrollbar } from "@/components/ui";

import Providers from "@/components/Providers";
import OykAppHeader from "@/components/core/AppHeader";
import OykAppSidebar from "@/components/core/AppSidebar";
import OykAppFooter from "@/components/core/AppFooter";
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
    }
  }, [route]);

  return (
    <main id="oyk-app-main">
      {route && route.component && !isLoadingAuth ? (
        <Suspense fallback={<OykAppLoading />}>
          <OykScrollbar isMainScroll height={"100%"}>
            <>
              {route.require_dev && !isDev ? <OykAppNotAuthorized /> : createElement(route.component)}
              {isAuth ? <OykAppFooter /> : null}
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
