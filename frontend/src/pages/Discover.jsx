import { useEffect } from "react";
import { Construction } from "lucide-react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykFeedback, OykGrid, OykHeading } from "@/components/ui";

export default function Discover() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("Discover"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-page oyk-discover">
      <OykHeading title={t("Discover")} />
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