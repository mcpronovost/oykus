import { useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { Construction } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { OykFeedback, OykGrid, OykHeading } from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";

export default function DevAdmin() {
  const { isDev } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  
  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("Admin"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  if (!isDev) return <OykAppNotAuthorized />;

  return (
    <section className="oyk-page oyk-about">
      <OykHeading title={t("Admin")} />
      <OykGrid>
        <OykFeedback ghost title={t("Under Construction")} message={t("This page is currently under construction. Please check back later.")} icon={Construction} />
      </OykGrid>
    </section>
  );
}