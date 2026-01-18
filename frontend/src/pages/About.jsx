import { Construction } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { OykFeedback, OykGrid, OykHeading } from "@/components/common";

export default function About() {
  const { t } = useTranslation();

  return (
    <section className="oyk-page oyk-about">
      <OykHeading title={t("About")} />
      <OykGrid>
        <OykFeedback ghost variant="warning" title={t("Under Construction")} message={t("This page is currently under construction. Please check back later.")} icon={Construction} />
      </OykGrid>
    </section>
  );
}