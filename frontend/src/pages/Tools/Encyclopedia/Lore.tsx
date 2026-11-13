import { IconNews } from "@tabler/icons-react";
import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";

export default function OykEncyclopediaLore() {
  const { t } = useTranslation();

  return (
    <OykResult
      icon={IconNews}
      title={t("Under Construction")}
      suptitle={t("encyclopedia.underConstruction.suptitle")}
      subtitle={t("encyclopedia.underConstruction.subtitle")}
    />
  );
}
