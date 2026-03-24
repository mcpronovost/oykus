import { MessagesSquare, Star } from "lucide-react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAlert } from "@/components/ui";

// ─── Tag config map ───────────────────────────────────────────────────────────
// Add new tags here without touching the component itself.
const ALERT_TAG_CONFIG = {
  blog_comment: {
    icon: MessagesSquare,
    variant: "card",
    clickable: true,
    getMessage: (payload) => payload?.comment_content,
    getRoute: (payload, n) =>
      n("universe-blog-post", {
        universeSlug: payload?.universe_slug,
        postId: payload?.post_id,
      }),
  },
  progress_title: {
    icon: Star,
    variant: "success",
    clickable: true,
    getMessage: (payload) => `"${payload?.title}"`,
    getRoute: (_payload, n) => n("settings-profile"),
  },
  // Add future tags here, e.g.:
  // achievement_unlocked: { icon: Trophy, variant: "success", ... }
};

const DEFAULT_CONFIG = {
  icon: undefined,
  variant: "card",
  clickable: false,
  getMessage: () => undefined,
  getRoute: () => undefined,
};

// ─────────────────────────────────────────────────────────────────────────────

export default function OykAlertsCard({ alert }) {
  const { n } = useRouter();
  const { t } = useTranslation();

  const config = ALERT_TAG_CONFIG[alert.tag] ?? DEFAULT_CONFIG;

  return (
    <li className="oyk-alerts-list-item" style={{ opacity: alert.is_read ? 0.6 : 1, marginBottom: 8 }}>
      <OykAlert
        variant={config.variant}
        ghost={alert.is_read}
        icon={config.icon}
        title={t(alert.title)}
        message={config.getMessage(alert.payload)}
        clickable={config.clickable}
        onClick={config.clickable ? () => config.getRoute(alert.payload, n) : undefined}
      />
    </li>
  );
}
