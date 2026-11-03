import { IconNote } from "@tabler/icons-react";
import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";

export default function OykNotes() {
  const { t } = useTranslation();

  return (
    <OykResult
      icon={IconNote}
      suptitle={t("Notes")}
      title={t("Under Construction")}
    />
  );
}
