// import "@/assets/styles/modules/progress.scss";
import { useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import { OykAlert, OykCard, OykGrid, OykHeading } from "@/components/ui";

export default function OykRewards() {
  const { isAuth } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  useEffect(() => {
    if (!isAuth || !currentUniverse || (currentUniverse && !currentUniverse.modules?.progress?.active)) return;
    const controller = new AbortController();

    routeTitle(currentUniverse.modules.progress.settings.display_name || t("Rewards"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  if (!isAuth || !currentUniverse || (currentUniverse && !currentUniverse.modules?.progress?.active)) {
    return <AppNotAuthorized />;
  }

  return (
    <section className="oyk-page oyk-progress">
      <OykHeading title={currentUniverse.modules.progress.settings.display_name || t("Rewards")} />
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
