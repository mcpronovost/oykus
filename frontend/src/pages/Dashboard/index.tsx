import "@/assets/styles/pages/_dashboard.scss";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconPlus } from "@tabler/icons-react";
import {
  OykButton,
  OykDivider,
  OykGrid,
  OykHeading,
  OykResult,
} from "@/components/ui";
import { listSpaces, queryKeys, type TypeSpace } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { getTimeGreeting } from "@/utils";
import OykDashboardModalsSpaceCreate from "./modals/SpaceCreate";
import OykDashboardModalsSpaceDelete from "./modals/SpaceDelete";
import OykSpaceCurrentCard from "./SpaceCurrentCard";
import OykSpaceShelfCard from "./SpaceShelfCard";

export default function OykDashboard() {
  const { isAuth, user, setCurrentSpace } = useAuth();
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<TypeSpace | null>(null);

  const handleSelectSpace = (spaceId: string) => {
    if (user?.currentSpace?.id === spaceId) return;
    void setCurrentSpace(spaceId);
  };

  const {
    data: spaces = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.spaces.list,
    queryFn: listSpaces,
  });

  if (!isAuth || user == null) return null;

  return (
    <div className="oyk-page-dashboard">
      <OykDashboardModalsSpaceCreate
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
      <OykDashboardModalsSpaceDelete
        space={spaceToDelete}
        setSpace={setSpaceToDelete}
      />
      <OykGrid>
        <OykHeading
          title={user?.name}
          suptitle={t(getTimeGreeting())}
          subtitle={t("Here's what's happening with your worlds")}
          actions={
            <OykButton
              label={t("New Space")}
              color="accent"
              start={IconPlus}
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
            {user.currentSpace && (
              <OykGrid.Col>
                <OykSpaceCurrentCard space={user.currentSpace} />
              </OykGrid.Col>
            )}
            <OykGrid.Col size={12} flex="horizontal" justify="start">
              <OykButton label={t("All")} size="sm" variant="pill" color="accent" />
            </OykGrid.Col>
            <OykGrid.Col size={12} flex="horizontal" justify="end">
              <OykButton label={t("Shelf")} size="sm" variant="pill" color="accent" />
              <OykButton label={t("List")} size="sm" variant="pill" disabled />
            </OykGrid.Col>
            <OykGrid.Col>
              <OykDivider start={t("Your worlds")} end={`${t("{count} spaces", spaces.length)}`} nop />
            </OykGrid.Col>
            <OykGrid.Col flex="horizontal" wrap>
              {spaces.map((space) => (
                <OykSpaceShelfCard
                  key={space.id}
                  space={space}
                  onSelect={(selected) => handleSelectSpace(selected.id)}
                  onDelete={setSpaceToDelete}
                />
              ))}
            </OykGrid.Col>
          </OykGrid.Row>
        )}
      </OykGrid>
    </div>
  );
}
