import { useEffect } from "react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykGrid, OykHeading } from "@/components/ui";

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
      </OykGrid>
    </section>
  );
}