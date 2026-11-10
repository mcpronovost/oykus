import { IconBooks } from "@tabler/icons-react";
import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";

export default function Encyclopedia() {
  const { t } = useTranslation();

  return (
    <OykResult
      icon={IconBooks}
      title={t("Under Construction")}
      suptitle={t("encyclopedia.underConstruction.suptitle")}
      subtitle={t("encyclopedia.underConstruction.subtitle")}
      message={t("encyclopedia.underConstruction.message")}
    />
  );
}
