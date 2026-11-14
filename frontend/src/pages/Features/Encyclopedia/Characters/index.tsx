import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykGrid, OykHeading, OykResult } from "@/components/ui";

export default function OykEncyclopediaCharacters() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user?.currentSpace) return null;

  return (
    <OykGrid>
      <OykHeading title={t("Characters")} suptitle={t("Encyclopedia")} />
      <OykResult
        title={t("Under Construction")}
        message={t("Come back later")}
        variant="ghost"
      />
    </OykGrid>
  );
}
