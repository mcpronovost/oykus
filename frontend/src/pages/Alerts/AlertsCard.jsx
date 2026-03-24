import { MessagesSquare, Star } from "lucide-react";

import { api } from "@/services/api";
import { useNotifications } from "@/services/notifications";
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
    getTitle: (payload, t) => (`${payload?.comment_author?.name || t("Someone")} ${t("commented on your blog post")}`),
    getMessage: (payload, t) => (`"${payload?.comment_content}"`),
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
    getTitle: () => undefined,
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
  getTitle: () => undefined,
  getMessage: () => undefined,
  getRoute: () => undefined,
};

// ─────────────────────────────────────────────────────────────────────────────

export default function OykAlertsCard({ alert }) {
  const { updateAlerts } = useNotifications();
  const { n } = useRouter();
  const { t } = useTranslation();

  const config = ALERT_TAG_CONFIG[alert.tag] ?? DEFAULT_CONFIG;

  const handleClick = async (a) => {
    if (!a.is_read) {
      try {
        const r = await api.post(`/courrier/alerts/${a.id}/read/`);
        if (r.ok) updateAlerts(r.unread || 0);
      } catch {
        // fail silently
      }
    }
    config.getRoute(a.payload, n);
  };

  return (
    <li className="oyk-alerts-list-item" style={{ opacity: alert.is_read ? 0.6 : 1, marginBottom: 8 }}>
      <OykAlert
        variant={config.variant}
        ghost={alert.is_read}
        icon={config.icon}
        title={config.getTitle(alert.payload, t) || t(alert.title)}
        message={config.getMessage(alert.payload, t)}
        clickable={config.clickable}
        onClick={config.clickable ? () => handleClick(alert) : undefined}
      />
    </li>
  );
}
