import { useEffect, useRef, useState } from "react";
import { Ellipsis, Frown } from "lucide-react";

import { oykCode, oykTimeAgo } from "@/utils";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";

import { OykAvatar, OykButton, OykCard } from "@/components/ui";

export default function OykProfileUserFeed({ user, post }) {
  const { currentUser } = useAuth();
  const { t, lang } = useTranslation();

  const [clamped, setClamped] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setClamped(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [post, showFull]);

  return (
    <article className="oyk-userprofile-feed-post">
      <OykCard>
        <header className="oyk-userprofile-feed-post-header">
          <OykAvatar size={48} src={user.avatar} />
          <div className="oyk-userprofile-feed-post-header-identity">
            <div className="oyk-userprofile-feed-post-header-identity-name">
              <span>{user.name}</span>
            </div>
            <div className="oyk-userprofile-feed-post-header-identity-date">
              <span>{oykTimeAgo(post.created_at, lang, currentUser?.timezone)}</span>
              {post.updated_at != post.created_at && (
                <span className="oyk-userprofile-feed-post-header-identity-date-edited">
                  {t("edited")}{" "}
                  <time dateTime={post.updated_at}>
                    {oykTimeAgo(post.updated_at, lang, currentUser?.timezone)}
                  </time>
                </span>
              )}
            </div>
          </div>
          <div className="oyk-userprofile-feed-post-header-actions">
            {/* <OykDropdown
              float
              toggle={<OykButton icon={Ellipsis} plain />}
              menu={[
                {
                  label: t("Report"),
                  // icon: <Pencil size={16} />,
                  onClick: () => {},
                },
              ]}
            /> */}
          </div>
        </header>
        <div ref={ref} className={`oyk-code ${showFull ? "oyk-showfull" : ""}`}>
          <div dangerouslySetInnerHTML={{ __html: oykCode(post.content) }}></div>
        </div>
        {clamped && (
          <OykButton small plain style={{ padding: "16px 0 0" }} onClick={() => setShowFull(true)}>
            {t("Show more")}
          </OykButton>
        )}
      </OykCard>
    </article>
  );
}
