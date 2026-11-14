import { useQuery } from "@tanstack/react-query";
import { IconSettings } from "@tabler/icons-react";
import { getSpaceStats, queryKeys, type TypeSpace } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykButton, OykCard, OykStats } from "@/components/ui";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";

type SpaceCurrentCardProps = {
  space: TypeSpace;
};

export default function OykSpaceCurrentCard({ space }: SpaceCurrentCardProps) {
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: queryKeys.spaces.stats(space.id),
    queryFn: () => getSpaceStats(space.id),
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
            <OykStats.Item label={t("Notes")} value={stats?.notes ?? 0} />
            {(stats?.encyclopedia ?? []).map((topic) => (
              <OykStats.Item
                key={topic.slug}
                label={t(`encyclopedia.topic.${topic.slug}`)}
                value={topic.count}
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
