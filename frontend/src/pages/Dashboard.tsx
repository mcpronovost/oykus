import { OykKanban } from "@/components/common";
import { OykGrid } from "@/components/ui";

export default function Dashboard() {
  return (
    <div>
      <OykGrid>
        <OykKanban />
      </OykGrid>
    </div>
  );
}
