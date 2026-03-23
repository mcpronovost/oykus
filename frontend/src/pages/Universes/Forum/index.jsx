// import "@/assets/styles/modules/_collections.scss";
import { useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import { OykAlert, OykCard, OykGrid, OykHeading } from "@/components/ui";

export default function OykUniverseForum() {
  const { isAuth } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  useEffect(() => {
    if (!currentUniverse || (currentUniverse && !currentUniverse.modules?.forum?.active)) return;
    const controller = new AbortController();

    routeTitle(currentUniverse.modules.forum.settings.display_name || t("Collections"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  if (!currentUniverse || (currentUniverse && !currentUniverse.modules?.forum?.active)) {
    return <AppNotAuthorized />;
  }

  return <section>construction</section>;
}
