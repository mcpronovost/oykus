import { useEffect } from "react";

import { useRouter } from "@/services/router";
import { Construction } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { OykFeedback, OykGrid, OykHeading } from "@/components/ui";

export default function About() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  
  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("About"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-page oyk-about">
      <OykHeading title={t("About")} />
      <OykGrid>
        <OykFeedback ghost variant="warning" title={t("Under Construction")} message={t("This page is currently under construction. Please check back later.")} icon={Construction} />
      </OykGrid>
    </section>
  );
}