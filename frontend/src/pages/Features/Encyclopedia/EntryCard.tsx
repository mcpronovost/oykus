import type { TypeEncyclopediaEntry } from "@/services/api";
import { getIcon, oykClass, oykTimeAgo } from "@/utils";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykCard, OykClamp } from "@/components/ui";

interface OykEncyclopediaEntryCardProps {
  entry: TypeEncyclopediaEntry;
  onClick: () => void;
}

export default function OykEncyclopediaEntryCard({
  entry,
  onClick,
}: OykEncyclopediaEntryCardProps) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const TopicIcon = getIcon(entry.topic?.icon);

  return (
    <OykCard hoverable clickable grow onClick={onClick}>
      <div className="oyk-page-encyclopedia-entrycard">
        <header
          className={oykClass(
            "oyk-page-encyclopedia-entrycard-header",
            entry.topic?.color &&
              `oyk-page-encyclopedia-entrycard-header-color-${entry.topic.color}`,
          )}
        >
          {TopicIcon && (
            <div className="oyk-page-encyclopedia-entrycard-header-icon">
              <TopicIcon size={20} stroke={1.5} />
            </div>
          )}
          <div>
            <h2 className="oyk-page-encyclopedia-entrycard-header-title">
              {entry.title}
            </h2>
            <p className="oyk-page-encyclopedia-entrycard-header-subtitle">
              {t(`encyclopedia.topic.${entry.topic?.slug}`)}
              {entry.category &&
                ` · ${t(`encyclopedia.category.${entry.category.slug}`)}`}
            </p>
          </div>
        </header>
        <div className="oyk-page-encyclopedia-entrycard-content">
          {entry.summary && (
            <OykClamp
              lines={3}
              className="oyk-page-encyclopedia-entrycard-content-summary"
            >
              {entry.summary}
            </OykClamp>
          )}
        </div>
        <footer className="oyk-page-encyclopedia-entrycard-footer">
          <div></div>
          <div>
            <span>
              {oykTimeAgo(entry.updatedAt, user?.language, user?.timezone)}
            </span>
          </div>
        </footer>
      </div>
    </OykCard>
  );
}
