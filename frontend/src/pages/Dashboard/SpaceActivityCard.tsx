import type { TypeSpaceLog } from "@/services/api";
import type { TypeTranslateFn } from "@/services/translation/types";
import { useQuery } from "@tanstack/react-query";
import { oykTimeAgo } from "@/utils";
import { listSpaceLogs, queryKeys } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykButton, OykCard, OykHeading } from "@/components/ui";

function getActivityText({ action, details }: TypeSpaceLog, t: TypeTranslateFn) {
  const actionKey = `activity.action.${action}`;
  const topicKey = `activity.encyclopedia.${details?.topic}`;
  const translatedTopic = t(topicKey);
  const label = t(actionKey, undefined, {
    kind: translatedTopic === topicKey ? t("activity.encyclopedia.entry") : translatedTopic,
    title: details?.title ?? t("activity.untitled"),
  });
  return label === actionKey ? t("activity.action.unknown") : label;
}

type SpaceActivityCardProps = {
  spaceId: string;
  timezone: string;
};

export default function OykSpaceActivityCard({ spaceId, timezone }: SpaceActivityCardProps) {
  const { lang, t } = useTranslation();
  const { data: logs, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.spaces.logs(spaceId),
    queryFn: ({ signal }) => listSpaceLogs(spaceId, signal),
    refetchOnMount: "always",
  });

  return (
    <OykCard>
      <section className="oyk-page-dashboard-activity">
        <OykHeading title={t("activity.recent")} tag="h2" variant="card" />
        {logs?.length ? (
          <ul className="oyk-page-dashboard-activity-list">
            {logs.map((log) => (
              <li key={log.id} className="oyk-page-dashboard-activity-item">
                <p>{getActivityText(log, t)}</p>
                <div className="oyk-page-dashboard-activity-meta">
                  <span>{log.userName ?? t("activity.unknownUser")}</span>
                  <time dateTime={log.createdAt}>{oykTimeAgo(log.createdAt, lang, timezone)}</time>
                </div>
              </li>
            ))}
          </ul>
        ) : isPending ? (
          <p role="status">{t("activity.loading")}</p>
        ) : isError ? (
          <div role="status">
            <p>{t("activity.loadError")}</p>
            <OykButton label={t("activity.retry")} size="sm" onClick={() => void refetch()} />
          </div>
        ) : (
          <p>{t("activity.empty")}</p>
        )}
      </section>
    </OykCard>
  );
}
