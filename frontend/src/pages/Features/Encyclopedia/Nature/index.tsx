import { IconLeaf } from "@tabler/icons-react";
import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";

export default function OykEncyclopediaNature() {
  const { t } = useTranslation();

  return (
    <OykResult
      icon={IconLeaf}
      title={t("Under Construction")}
      suptitle={t("encyclopedia.underConstruction.suptitle")}
      subtitle={t("encyclopedia.underConstruction.subtitle")}
    />
  );
}
