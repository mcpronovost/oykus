import "@/assets/styles/pages/_dashboard.scss";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconPlus } from "@tabler/icons-react";
import { OykButton, OykCard, OykDivider, OykGrid, OykHeading, OykResult } from "@/components/ui";
import { listSpaces, queryKeys } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { getTimeGreeting } from "@/utils";
import OykDashboardModalsSpaceCreate from "./modals/SpaceCreate";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";
import ImgPlaceholder2 from "@/assets/img/space-cover-2.webp";

export default function OykDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: spaces = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.spaces.list,
    queryFn: listSpaces,
  });

  return (
    <div className="oyk-page-dashboard">
      <OykDashboardModalsSpaceCreate modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <OykGrid>
        <OykHeading
          title={user?.name}
          suptitle={t(getTimeGreeting())}
          subtitle={t("Here's what's happening with your worlds")}
          actions={
            <OykButton label={t("New Space")} color="accent" icon={IconPlus} onClick={() => setModalOpen(true)} />
          }
        />

        {isPending ? (
          <OykResult title="Loading spaces" message="Fetching your worlds..." variant="ghost" />
        ) : isError ? (
          <OykResult
            title="Could not load spaces"
            message="Something went wrong while fetching your spaces."
            color="danger"
            variant="ghost"
          >
            <OykButton label="Try again" color="accent" onClick={() => refetch()} />
          </OykResult>
        ) : spaces.length === 0 ? (
          <OykResult title="No spaces found" message="Create a new space to get started" variant="ghost" />
        ) : (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykCard outlined hoverable gradient="accent">
                <div className="oyk-page-dashboard-currentspace">
                  <img
                    src={ImgPlaceholder1}
                    alt={user.currentSpace?.name}
                    className="oyk-page-dashboard-currentspace-cover"
                  />
                </div>
              </OykCard>
            </OykGrid.Col>
            <OykGrid.Col>
              <OykDivider start="Your words" end={`${spaces.length} spaces`} />
            </OykGrid.Col>
            <OykGrid.Col flex="horizontal">
              {spaces.map((space, index) => (
                <div key={space.id}>
                  <OykCard hoverable clickable nop>
                    <div
                      style={{
                        backgroundImage: `url(${index === 0 ? ImgPlaceholder1 : ImgPlaceholder2})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "var(--oyk-radius)",
                        width: "180px",
                        height: "256px",
                      }}
                    ></div>
                  </OykCard>
                  <p>{space.name}</p>
                </div>
              ))}
            </OykGrid.Col>
          </OykGrid.Row>
        )}
      </OykGrid>
    </div>
  );
}
