import { useQueries, useQuery } from "@tanstack/react-query";
import { IconSettings } from "@tabler/icons-react";
import {
  listEncyclopediaEntries,
  listEncyclopediaTopics,
  listNotes,
  queryKeys,
  type TypeSpace,
} from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykButton, OykCard, OykStats } from "@/components/ui";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";

type SpaceCurrentCardProps = {
  space: TypeSpace;
};

export default function OykSpaceCurrentCard({ space }: SpaceCurrentCardProps) {
  const { t } = useTranslation();

  const { data: notes = [] } = useQuery({
    queryKey: queryKeys.notes.list(space.id),
    queryFn: () => listNotes(space.id),
  });

  const { data: topics = [] } = useQuery({
    queryKey: queryKeys.encyclopedia.topics,
    queryFn: listEncyclopediaTopics,
  });

  const encyclopediaQueries = useQueries({
    queries: topics.map((topic) => ({
      queryKey: queryKeys.encyclopedia.list(space.id, topic.slug),
      queryFn: () => listEncyclopediaEntries(space.id, topic.slug),
    })),
  });

  return (
    <OykCard outlined hoverable gradient="accent">
      <section className="oyk-page-dashboard-currentspace">
        <img
          src={space.cover || ImgPlaceholder1}
          alt={space.name}
          className="oyk-page-dashboard-currentspace-cover"
        />
        <div className="oyk-page-dashboard-currentspace-content">
          <header>
            <p className="oyk-page-dashboard-currentspace-content-suptitle">{t("Continue working on")}</p>
            <h2 className="oyk-page-dashboard-currentspace-content-title">{space.name}</h2>
            <p className="oyk-page-dashboard-currentspace-content-subtitle">{space.description}</p>
          </header>
          <OykStats justify="start">
            {/* On future Manuscript plugin: <OykStats.Item label="Words" value="0" /> */}
            <OykStats.Item label={t("Notes")} value={notes.length} />
            {topics.map((topic, index) => (
              <OykStats.Item
                key={topic.id}
                label={t(`encyclopedia.topic.${topic.slug}`)}
                value={encyclopediaQueries[index]?.data?.length ?? 0}
              />
            ))}
          </OykStats>
          <footer className="oyk-page-dashboard-currentspace-content-actions">
             {/* On future Manuscript plugin: <OykButton routeName="manuscript" label="Continue Chapter" color="accent" /> */}
            <OykButton routeName="encyclopedia" label={t("Open Encyclopedia")} />
            <OykButton variant="ghost" start={IconSettings} shrink />
          </footer>
        </div>
      </section>
    </OykCard>
  );
}
