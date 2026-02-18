import { useRef } from "react";
import { Bell, Mail, Smile, ScrollText } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useNotifications } from "@/services/notifications";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAvatar, OykButton, OykDropdown, OykLink } from "@/components/ui";

export default function AppHeaderNotifications() {
  const { isAuth } = useAuth();
  const { notifications } = useNotifications();
  const { n } = useRouter();
  const { t, lang } = useTranslation();

  const dropdownRef = useRef(null);

  if (!isAuth) return null;

  return (
    <section className="oyk-app-header-notifications">
      <div className="oyk-app-header-notifications-group">
        <OykDropdown
          ref={dropdownRef}
          toggle={
            <OykButton
              plain
              icon={Bell}
              iconSize={18}
              badgeCount={notifications?.alerts?.length}
              badgeBorderColor="var(--oyk-app-header-bg)"
            />
          }
          menu={[
            ...(notifications?.alerts
              ? notifications?.alerts?.map((alert) => ({
                  element: (
                    <article className="oyk-app-header-notifications-alert">
                      <div className="oyk-app-header-notifications-alert-icon">
                        <OykAvatar
                          src={alert.payload?.comment_author?.avatar}
                          icon={ScrollText}
                          size={32}
                          bgColor="var(--oyk-app-header-subtle-bg)"
                          fgColor="var(--oyk-app-header-subtle-fg)"
                          borderSize={0}
                        />
                      </div>
                      <div className="oyk-app-header-notifications-alert-content">
                        {alert.tag === "blog_comment" && alert.payload?.comment_author ? (
                          <OykLink
                            routeName="blog-post"
                            params={{ universeSlug: alert.payload.universe_slug, postId: alert.payload?.post_id }}
                            colorHover="opacity-6"
                            onClick={() => {
                              dropdownRef.current.close();
                            }}
                          >
                            <strong>{alert.payload?.comment_author?.name}</strong> {t("commented on your blog post")}{" "}
                            <strong>{alert.payload?.post_title}</strong>
                          </OykLink>
                        ) : (
                          <p>{alert.title}</p>
                        )}
                      </div>
                    </article>
                  ),
                }))
              : []),
            {
              element: (
                <div className="oyk-app-header-notifications-alert-footer">
                  <OykButton plain small block>
                    View all
                  </OykButton>
                </div>
              ),
            },
          ]}
        />
      </div>
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Smile}
          iconSize={18}
          badgeDot={notifications?.friends}
          badgeBorderColor="var(--oyk-app-header-bg)"
          onClick={() => (notifications?.friends ? n("settings-friends-requests") : n("settings-friends"))}
        />
      </div>
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Mail}
          iconSize={18}
          badgeDot={notifications?.messages}
          badgeBorderColor="var(--oyk-app-header-bg)"
          disabled
        />
      </div>
    </section>
  );
}
