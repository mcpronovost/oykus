import { IconBooks, IconHammer, IconSparkles } from "@tabler/icons-react";
import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";

export default function Library() {
  const { t } = useTranslation();

  return (
    <OykResult
      icon={IconBooks}
      title={t("Under Construction")}
      suptitle={t("library.underConstruction.suptitle")}
      subtitle={t("library.underConstruction.subtitle")}
      message={t("library.underConstruction.message")}
    />
  );
}
