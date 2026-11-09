import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { OykButton, OykGrid, OykHeading, OykResult } from "@/components/ui";
import { getTimeGreeting } from "@/utils";

export default function OykDashboard() {
  const { user } = useAuth();

  return (
    <div className="oyk-page-dashboard">
      <OykGrid>
        <OykHeading
          title={user?.name}
          suptitle={getTimeGreeting()}
          subtitle="Here's what's happening with your worlds"
          actions={<OykButton label="New Space" color="accent" icon={IconPlus} />}
        />
        <OykResult title="No spaces found" message="Create a new space to get started" variant="ghost" />
      </OykGrid>
    </div>
  );
}
