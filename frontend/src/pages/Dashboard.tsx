import { OykKanban } from "@/components/common";
import { OykGrid } from "@/components/ui";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <OykGrid>
        <OykKanban />
      </OykGrid>
    </div>
  );
}
