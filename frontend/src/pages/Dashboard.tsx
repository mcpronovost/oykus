import { OykKanban, OykResult } from "@/components/common";
import { OykGrid } from "@/components/ui";

export default function OykDashboard() {
  return (
    <div className="oyk-page-dashboard">
      <OykGrid>
        <OykResult />
      </OykGrid>
    </div>
  );
}
