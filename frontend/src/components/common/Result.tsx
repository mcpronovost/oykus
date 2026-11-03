import type { TablerIcon } from "@tabler/icons-react";
import { useTranslation } from "@/services/translation";
import { IconMoodEmpty, IconHammer, IconSparkles } from "@tabler/icons-react";

interface OykResultProps {
  icon?: TablerIcon;
  title: string;
  suptitle?: string;
  subtitle?: string;
  message?: string;
}

export default function OykResult({
  icon: Icon = IconMoodEmpty,
  title,
  suptitle,
  subtitle,
  message,
}: OykResultProps) {
  const { t } = useTranslation();

  return (
    <div className="oyk-result">
      <div className="oyk-result-panel" role="status" aria-labelledby="oyk-result-title">
        <div className="oyk-result-visual" aria-hidden="true">
          <div className="oyk-result-ring oyk-result-ring--outer" />
          <div className="oyk-result-ring oyk-result-ring--mid" />
          <div className="oyk-result-halo">
            <Icon className="oyk-result-icon" size={56} stroke={1} />
          </div>
          <span className="oyk-result-badge oyk-result-badge--hammer">
            <IconHammer size={18} stroke={1.6} />
          </span>
          <span className="oyk-result-badge oyk-result-badge--sparkles">
            <IconSparkles size={16} stroke={1.6} />
          </span>
        </div>
        {suptitle && <p className="oyk-result-suptitle">{suptitle}</p>}
        {title && (
          <h1 id="oyk-result-title" className="oyk-result-title">
            {title}
          </h1>
        )}
        {subtitle && <p className="oyk-result-subtitle">{subtitle}</p>}
        {message && <p className="oyk-result-message">{message}</p>}
      </div>
    </div>
  );
}
