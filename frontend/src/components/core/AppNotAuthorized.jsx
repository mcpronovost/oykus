import { ShieldX } from "lucide-react";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton, OykFeedback, OykGrid, OykHeading } from "@/components/ui";

export default function AppNotAuthorized() {
  const { n } = useRouter();
  const { t } = useTranslation();

  return (
    <section className="oyk-page oyk-error401">
      <OykHeading title="401" />
      <OykGrid>
        <OykFeedback ghost title={t("Not Authorized")} message={t("You are not authorized to access this page.")} icon={ShieldX}>
          <OykButton action={() => n("home")} color="primary">
            {t("Go to Home")}
          </OykButton>
        </OykFeedback>
      </OykGrid>
    </section>
  );
}