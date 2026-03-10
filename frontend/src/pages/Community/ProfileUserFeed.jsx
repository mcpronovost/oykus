import { useEffect, useState } from "react";
import { Ellipsis, Frown } from "lucide-react";

import { oykCode, oykDate, oykTimeAgo } from "@/utils";
import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";

import { OykAvatar, OykButton, OykCard, OykDropdown, OykFeedback, OykLoading } from "@/components/ui";

export default function OykProfileUserFeed({ user }) {
  const { n, params } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [activities, setActivities] = useState([]);

  const fetchActivities = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      if (!params?.userSlug) throw new Error(t("User doesn't exist"));
      const r = await api.get(`/auth/users/${params.userSlug}/profile/activities/`, signal ? { signal } : {});
      if (!r?.ok || !r?.activities) throw r;
      setActivities(r.activities);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: t(e?.error) || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchActivities(controller.signal);

    return () => {
      controller.abort();
    };
  }, [params]);

  return (
    <section className="oyk-userprofile-feed">
      {hasError ? (
        <OykFeedback ghost variant="danger" title={t("Error")} message={hasError.message} />
      ) : isLoading ? (
        <OykLoading />
      ) : activities && activities.length > 0 ? (
        activities.map((post) => (
          <article className="oyk-userprofile-feed-post">
            <OykCard>
              <header className="oyk-userprofile-feed-post-header">
                <OykAvatar size={48} src={user.avatar} />
                <div className="oyk-userprofile-feed-post-header-identity">
                  <div className="oyk-userprofile-feed-post-header-identity-name">
                    <span>{user.name}</span>
                  </div>
                  <div className="oyk-userprofile-feed-post-header-identity-date">
                    <span>{oykTimeAgo(post.created_at)}</span>
                  </div>
                </div>
                <div className="oyk-userprofile-feed-post-header-actions">
                  <OykDropdown
                    float
                    toggle={<OykButton icon={Ellipsis} plain />}
                    menu={[
                      {
                        label: t("Report"),
                        // icon: <Pencil size={16} />,
                        onClick: () => {},
                      },
                    ]}
                  />
                </div>
              </header>
              <div className="oyk-code">
                <div dangerouslySetInnerHTML={{ __html: oykCode(post.content) }}></div>
              </div>
            </OykCard>
          </article>
        ))
      ) : (
        <>
          <OykFeedback
            ghost
            title={t("No posts")}
            message={t("This user has no activity at the moment")}
            icon={Frown}
          />
        </>
      )}
    </section>
  );
}
