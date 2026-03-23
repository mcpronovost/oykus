import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAlert, OykButton, OykCard, OykFeedback, OykHeading, OykLoading } from "@/components/ui";
import OykModalFriendsAdd from "./modals/FriendsAdd";
import OykFriendsRequestsCard from "./FriendsRequestsCard";

export default function SettingsFriendsRequests() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendPendings, setFriendPendings] = useState([]);
  const [isModalFriendsAddOpen, setIsModalFriendsAddOpen] = useState(false);

  const handleModalFriendsAddClose = (updated) => {
    setIsModalFriendsAddOpen(false);
    if (updated) {
      fetchFriendsRequestsData();
    }
  };

  const postFriendsRequests = async (action, friendSlug) => {
    if (!action || !friendSlug) return;
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("slug", friendSlug);
      const r = await api.post(`/social/friends/${action}/`, formData);
      if (!r.ok) throw Error();
      fetchFriendsRequestsData();
    } catch (e) {
      setHasError(() => ({
        [`friend-${friendSlug}`]: e.message || t("An error occurred"),
      }));
    }
  };

  const fetchFriendsRequestsData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/social/friends/requests/", signal ? { signal } : {});
      if (!r.ok || !r.requests) throw Error();
      setFriendRequests(r.requests);
      setFriendPendings(r.pendings);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        fetch: t("An error occurred"),
      });
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Settings")} - ${t("Friends Requests")}`);

    fetchFriendsRequestsData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-settings-friends-requests">
      <OykModalFriendsAdd isOpen={isModalFriendsAddOpen} onClose={handleModalFriendsAddClose} />
      <OykHeading
        subtitle
        tag="h2"
        title={t("Friends Requests")}
        nop
        actions={
          <OykButton small color="primary" onClick={() => setIsModalFriendsAddOpen(true)}>
            {t("Add a Friend")}
          </OykButton>
        }
      />
      {hasError?.fetch ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={`${t("Unable to access friends requests")}. ${t("Check your internet connection or try again later")}`}
            variant="danger"
          />
        </OykCard>
      ) : isLoading ? (
        <OykLoading />
      ) : (
        <OykCard>
          {friendRequests?.length > 0 ? (
            <ul className="oyk-settings-friends-requests-list">
              {friendRequests.map((f) => (
                <OykFriendsRequestsCard
                  key={f.slug}
                  data={f}
                  onAccept={postFriendsRequests}
                  onReject={postFriendsRequests}
                  hasError={hasError?.[`friend-${f.slug}`]}
                  isRequest
                />
              ))}
            </ul>
          ) : null}
          {friendPendings?.length > 0 ? (
            <ul className="oyk-settings-friends-requests-list">
              {friendPendings.map((f) => (
                <OykFriendsRequestsCard
                  key={f.slug}
                  data={f}
                  onCancel={postFriendsRequests}
                  hasError={hasError?.[`friend-${f.slug}`]}
                />
              ))}
            </ul>
          ) : null}
          {(!friendRequests || friendRequests.length <= 0) && (!friendPendings || friendPendings.length <= 0) ? (
            <OykFeedback ghost title={t("No pending requests")} icon={Users}>
              <OykButton color="primary" onClick={() => setIsModalFriendsAddOpen(true)}>
                {t("Add a Friend")}
              </OykButton>
            </OykFeedback>
          ) : null}
        </OykCard>
      )}
    </section>
  );
}
