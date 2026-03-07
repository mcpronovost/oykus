// import "@/assets/styles/modules/_collections.scss";
import { useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import { OykAlert, OykCard, OykGrid, OykHeading } from "@/components/ui";

export default function OykCollections() {
  const { isAuth } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  useEffect(() => {
    if (!isAuth || !currentUniverse || (currentUniverse && !currentUniverse.modules?.collections?.active)) return;
    const controller = new AbortController();

    routeTitle(currentUniverse.modules.collections.settings.display_name || t("Collections"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  if (!isAuth || !currentUniverse || (currentUniverse && !currentUniverse.modules?.collections?.active)) {
    return <AppNotAuthorized />;
  }

  return (
    <section className="oyk-page oyk-collections">
      <OykHeading title={currentUniverse.modules.collections.settings.display_name || t("Collections")} />
      <OykGrid>
        <OykCard>
          <OykAlert ghost variant="default">
            {t("Under Construction")}...
          </OykAlert>
        </OykCard>
      </OykGrid>
    </section>
  );
}
