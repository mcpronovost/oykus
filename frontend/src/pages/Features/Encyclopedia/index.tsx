import "@/assets/styles/pages/_encyclopedia.scss";
import { useQuery } from "@tanstack/react-query";
import { IconBooksOff } from "@tabler/icons-react";
import { getEncyclopediaStats, queryKeys } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { getIcon } from "@/utils";
import { OykGrid, OykHeading, OykResult } from "@/components/ui";
import OykEncyclopediaTopicsCard from "./TopicsCard";

export default function OykEncyclopedia() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const spaceId = user?.currentSpace?.id ?? null;

  const { data: stats } = useQuery({
    queryKey: queryKeys.encyclopedia.stats(spaceId ?? ""),
    queryFn: () => getEncyclopediaStats(spaceId!),
    enabled: Boolean(spaceId),
  });

  const topics = stats?.topics ?? [];
  const totalEntries = stats?.total ?? 0;

  if (!user?.currentSpace || !spaceId) return null;

  return (
    <div className="oyk-page-encyclopedia">
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
      </OykGrid>
    </div>
  );
}
