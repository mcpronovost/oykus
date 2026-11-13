import { IconUsers } from "@tabler/icons-react";
import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";

export default function OykEncyclopediaCharacters() {
  const { t } = useTranslation();

  return (
    <OykResult
      icon={IconUsers}
      title={t("Under Construction")}
      suptitle={t("encyclopedia.underConstruction.suptitle")}
      subtitle={t("encyclopedia.underConstruction.subtitle")}
    />
  );
}
