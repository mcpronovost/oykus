import { useEffect } from "react";

import { useRouter } from "@/services/router";
import { Construction } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { OykFeedback, OykGrid, OykHeading } from "@/components/ui";

export default function Devlog() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("Devlog"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-page oyk-devlog">
      <OykHeading title={t("Devlog")} />
      <OykGrid>
        <OykFeedback
          ghost
          title={t("Under Construction")}
          message={t("This page is currently under construction. Please check back later.")}
          icon={Construction}
        />
      </OykGrid>
    </section>
  );
}
