import "@/assets/styles/pages/_encyclopedia.scss";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconBooksOff } from "@tabler/icons-react";
import {
  type TypeEncyclopediaEntry,
  getEncyclopediaStats,
  listRecentEncyclopediaEntries,
  queryKeys,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { getIcon } from "@/utils";
import { OykDivider, OykGrid, OykHeading, OykResult } from "@/components/ui";
import OykEncyclopediaDrawerEntry from "./drawers/EntryPreview";
import OykEncyclopediaEntryCard from "./EntryCard";
import OykEncyclopediaModalsEditEntry from "./modals/EntryEdit";
import OykEncyclopediaTopicsCard from "./TopicsCard";

export default function OykEncyclopedia() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const spaceId = user?.currentSpace?.id ?? null;

  const [drawerEntryOpen, setDrawerEntryOpen] = useState(false);
  const [drawerEntry, setDrawerEntry] = useState<TypeEncyclopediaEntry | null>(null);
  const [modalEditEntryOpen, setModalEditEntryOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: queryKeys.encyclopedia.stats(spaceId ?? ""),
    queryFn: () => getEncyclopediaStats(spaceId!),
    enabled: Boolean(spaceId),
  });

  const { data: recentEntries = [] } = useQuery({
    queryKey: queryKeys.encyclopedia.recent(spaceId ?? ""),
    queryFn: () => listRecentEncyclopediaEntries(spaceId!),
    enabled: Boolean(spaceId),
  });

  const topics = stats?.topics ?? [];
  const totalEntries = stats?.total ?? 0;

  const handleEntryClick = (entry: TypeEncyclopediaEntry) => {
    setDrawerEntry(entry);
    setDrawerEntryOpen(true);
  };

  const handleOpenEdit = (entry: TypeEncyclopediaEntry) => {
    setDrawerEntry(entry);
    setModalEditEntryOpen(true);
  };

  if (!user?.currentSpace || !spaceId) return null;

  return (
    <div className="oyk-page-encyclopedia">
      <OykEncyclopediaModalsEditEntry
        modalOpen={modalEditEntryOpen}
        setModalOpen={setModalEditEntryOpen}
        entry={drawerEntry}
        onUpdated={setDrawerEntry}
        onDeleted={() => {
          setDrawerEntryOpen(false);
          setDrawerEntry(null);
        }}
      />
      <OykEncyclopediaDrawerEntry
        drawerOpen={drawerEntryOpen}
        setDrawerOpen={setDrawerEntryOpen}
        entry={drawerEntry}
        onOpenEdit={handleOpenEdit}
      />
      <OykGrid>
        <OykHeading title={t("Encyclopedia")} suptitle={user.currentSpace.name} />
        <OykGrid.Row>
          <OykGrid.Col>
            {topics.length === 0 ? (
              <OykResult
                title={t("No topics yet")}
                message={t("Contact your administrator to create a new topic")}
                variant="ghost"
                icon={IconBooksOff}
              />
            ) : (
              <div className="oyk-page-encyclopedia-topics">
                {topics.map((topic) => (
                  <OykEncyclopediaTopicsCard
                    key={topic.slug}
                    label={t(`encyclopedia.topic.${topic.slug}`)}
                    route={`encyclopedia-${topic.slug}`}
                    value={topic.count}
                    total={totalEntries}
                    icon={getIcon(topic.icon)}
                    color={topic.color}
                  />
                ))}
              </div>
            )}
          </OykGrid.Col>
        </OykGrid.Row>
        {recentEntries.length > 0 ? (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykDivider start={t("Recently Edited")} />
            </OykGrid.Col>
            {recentEntries.map((entry) => (
              <OykGrid.Col key={entry.id} size={{ xs: 24, md: 12, xl: 8, xxl: 6 }}>
                <OykEncyclopediaEntryCard
                  entry={entry}
                  onClick={() => handleEntryClick(entry)}
                />
              </OykGrid.Col>
            ))}
          </OykGrid.Row>
        ) : null}
      </OykGrid>
    </div>
  );
}
