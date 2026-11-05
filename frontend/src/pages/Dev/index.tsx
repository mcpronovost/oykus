import { useTranslation } from "@/services/translation";
import { OykAlert, OykGrid } from "@/components/ui";

export default function OykDev() {
  const { t } = useTranslation();

  return (
    <OykGrid>
      <OykAlert />
    </OykGrid>
  );
}
