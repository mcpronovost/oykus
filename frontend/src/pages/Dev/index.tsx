import { useTranslation } from "@/services/translation";
import { OykAlert, OykGrid } from "@/components/ui";

export default function OykDev() {
  const { t } = useTranslation();

  return (
    <OykGrid>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <OykAlert title="Alert" message="This is an alert" type="default" />
        <OykAlert title="Alert" message="This is an alert" type="accent" />
        <OykAlert title="Alert" message="This is an alert" type="success" />
        <OykAlert title="Alert" message="This is an alert" type="danger" />
        <OykAlert title="Alert" message="This is an alert" type="info" />
        <OykAlert title="Alert" message="This is an alert" type="warning" />
        <OykAlert title="Alert" message="This is an alert" type="special" />
      </div>
    </OykGrid>
  );
}
