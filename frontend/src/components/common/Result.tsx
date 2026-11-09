import type { TablerIcon } from "@tabler/icons-react";
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
  return (
    <div className="oyk-pageresult">
      <div className="oyk-pageresult-panel" role="status" aria-labelledby="oyk-pageresult-title">
        <div className="oyk-pageresult-visual" aria-hidden="true">
          <div className="oyk-pageresult-ring oyk-pageresult-ring--outer" />
          <div className="oyk-pageresult-ring oyk-pageresult-ring--mid" />
          <div className="oyk-pageresult-halo">
            <Icon className="oyk-pageresult-icon" size={56} stroke={1} />
          </div>
          <span className="oyk-pageresult-badge oyk-pageresult-badge--hammer">
            <IconHammer size={18} stroke={1.6} />
          </span>
          <span className="oyk-pageresult-badge oyk-pageresult-badge--sparkles">
            <IconSparkles size={16} stroke={1.6} />
          </span>
        </div>
        {suptitle && <p className="oyk-pageresult-suptitle">{suptitle}</p>}
        {title && (
          <h1 id="oyk-pageresult-title" className="oyk-pageresult-title">
            {title}
          </h1>
        )}
        {subtitle && <p className="oyk-pageresult-subtitle">{subtitle}</p>}
        {message && <p className="oyk-pageresult-message">{message}</p>}
      </div>
    </div>
  );
}
