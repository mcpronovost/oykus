import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";

export default function OykDev() {
  const { t } = useTranslation();

  return (
    <OykResult />
  );
}
