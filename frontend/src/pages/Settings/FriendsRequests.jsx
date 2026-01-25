import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykAlert,
  OykButton,
  OykCard,
  OykFeedback,
  OykLoading,
} from "@/components/ui";
import OykModalFriendsAdd from "./modals/FriendsAdd";

export default function SettingsFriendsInvites() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendPendings, setFriendPendings] = useState([]);
  const [isModalFriendsAddOpen, setIsModalFriendsAddOpen] = useState(false);

  const handleFriendsAddClose = (updated) => {
    setIsModalFriendsAddOpen(false);
    if (updated) {
      fetchFriendsInvitesData();
    }
  };

  const fetchFriendsInvitesData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get("/auth/friends/requests/", signal ? { signal } : {});
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

    routeTitle(`${t("Settings")} - ${t("Friends Invites")}`);

    fetchFriendsInvitesData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-settings-friends-requests">
      <OykModalFriendsAdd isOpen={isModalFriendsAddOpen} onClose={handleFriendsAddClose} />
      {hasError?.fetch ? (
        <OykCard>
          <OykAlert
            title={t("An error occurred")}
            message={`${t("Unable to access friends requests")}. ${t("Check your internet connection or try again later")}`}
            variant="danger"
          />
        </OykCard>
      ) : (
        <OykCard>
          {isLoading ? (
            <OykLoading />
          ) : (
            <div>
                {friendRequests?.length > 0 ? (
                    <div>aaa</div>
                ) : (
                    <OykFeedback ghost title={t("No pending requests")} icon={Users}>
                      <OykButton color="primary" action={() => setIsModalFriendsAddOpen(true)}>{t("Add a Friend")}</OykButton>
                    </OykFeedback>
                )}
            </div>
          )}
        </OykCard>
      )}
    </section>
  );
}
