import { Ghost } from "lucide-react";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton, OykFeedback, OykGrid, OykHeading } from "@/components/ui";

export default function Error404() {
  const { n } = useRouter();
  const { t } = useTranslation();

  return (
    <section className="oyk-page oyk-error404">
      <OykHeading title="404" />
      <OykGrid>
        <OykFeedback ghost title={t("Page Not Found")} message={t("The page you are looking for does not exist. Please check the URL and try again.")} icon={Ghost}>
          <OykButton onClick={() => n("home")} color="primary">
            {t("Go to Home")}
          </OykButton>
        </OykFeedback>
      </OykGrid>
    </section>
  );
}