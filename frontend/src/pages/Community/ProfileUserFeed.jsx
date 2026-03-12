import { useEffect, useState } from "react";
import { Ellipsis, Frown } from "lucide-react";

import { oykCode, oykDate, oykTimeAgo } from "@/utils";
import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";

import { OykAvatar, OykButton, OykCard, OykDropdown, OykFeedback, OykLoading } from "@/components/ui";
import OykProfileUserFeedCard from "./ProfileUserFeedCard";

export default function OykProfileUserFeed({ user }) {
  const { currentUser } = useAuth();
  const { n, params } = useRouter();
  const { t, lang } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activitiesOffset, setActivitiesOffset] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const fetchActivities = async (signal) => {
    if (activities.length <= 0) setIsLoading(true);
    else setIsLoadingMore(true);
    setHasError(null);
    try {
      if (!params?.userSlug) throw new Error(t("User doesn't exist"));
      const r = await api.get(`/auth/users/${params.userSlug}/profile/activities/${activitiesOffset}/`, signal ? { signal } : {});
      if (!r?.ok || !r?.activities) throw r;
      setActivities((prev) => [...prev, ...r.activities]);
      if (r.activities.length === 5) {
        setShowLoadMore(true);
        setActivitiesOffset((prev) => prev + 5);
      } else setShowLoadMore(false);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: t(e?.error) || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  };

  const handleNextActivities = () => {
    fetchActivities();
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
        activities.map((post, index) => (
          <OykProfileUserFeedCard key={index} user={user} post={post} />
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
      {showLoadMore ? (
        <div className="oyk-userprofile-feed-loadmore">
          <OykButton color="primary" isLoading={isLoadingMore} disabled={isLoadingMore} onClick={handleNextActivities}>
            {t("Load more")}
          </OykButton>
        </div>
      ) : null}
    </section>
  );
}
