import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconPlus } from "@tabler/icons-react";
import {
  OykButton,
  OykCard,
  OykDivider,
  OykGrid,
  OykHeading,
  OykResult,
} from "@/components/ui";
import { listSpaces, queryKeys } from "@/services/api";
import { useAuth } from "@/services/auth";
import { getTimeGreeting } from "@/utils";
import OykDashboardModalsSpaceCreate from "./modals/SpaceCreate";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";
import ImgPlaceholder2 from "@/assets/img/space-cover-2.webp";

export default function OykDashboard() {
  const { user } = useAuth();
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
      <OykDashboardModalsSpaceCreate
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
      <OykGrid>
        <OykHeading
          title={user?.name}
          suptitle={getTimeGreeting()}
          subtitle="Here's what's happening with your worlds"
          actions={
            <OykButton
              label="New Space"
              color="accent"
              icon={IconPlus}
              onClick={() => setModalOpen(true)}
            />
          }
        />

        {isPending ? (
          <OykResult
            title="Loading spaces"
            message="Fetching your worlds..."
            variant="ghost"
          />
        ) : isError ? (
          <OykResult
            title="Could not load spaces"
            message="Something went wrong while fetching your spaces."
            color="danger"
            variant="ghost"
          >
            <OykButton
              label="Try again"
              color="accent"
              onClick={() => refetch()}
            />
          </OykResult>
        ) : spaces.length === 0 ? (
          <OykResult
            title="No spaces found"
            message="Create a new space to get started"
            variant="ghost"
          />
        ) : (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykCard outlined hoverable gradient="accent">
                <div
                  style={{
                    backgroundColor: "var(--oyk-card-bg)",
                    backgroundImage: `url(${ImgPlaceholder1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid var(--oyk-c-accent-faint)",
                    borderRadius: "var(--oyk-radius)",
                    width: "180px",
                    height: "256px",
                  }}
                ></div>
              </OykCard>
            </OykGrid.Col>
            <OykGrid.Col>
              <OykDivider start="Your worlds" end={`${spaces.length} spaces`} />
            </OykGrid.Col>
            <OykGrid.Col flex="horizontal">
              {spaces.map((space, index) => (
                <div>
                  <OykCard key={space.id} hoverable clickable nop>
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
                  {user?.currentSpaceId === space.id ? (
                    <p style={{ marginBottom: 0, opacity: 0.7 }}>
                      Current space
                    </p>
                  ) : null}
                </div>
              ))}
            </OykGrid.Col>
          </OykGrid.Row>
        )}
      </OykGrid>
    </div>
  );
}
