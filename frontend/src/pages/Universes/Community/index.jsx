import "@/assets/styles/page/community.scss";
import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";
import {
  OykBanner,
  OykCard,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridCol,
  OykHeading,
  OykLoading,
} from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";

export default function OykCommunity() {
  const { params, routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [users, setUsers] = useState(null);
  const [characters, setCharacters] = useState(null);

  const fetchCommunity = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/world/universes/${currentUniverse.slug}/community/`, signal ? { signal } : {});
      if (!r?.ok || (!r?.characters && !r?.users)) throw r;
      setCharacters(r.characters);
      setUsers(r.users);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: e.error || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("Community"));
    fetchCommunity(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, [params]);

  return (
    <section className="oyk-page oyk-community">
      <OykHeading title={t("Community")} />
      <OykGrid>
        {hasError && hasError.message == 401 ? (
          <OykAppNotAuthorized />
        ) : hasError ? (
          <OykFeedback ghost variant="danger" title={t("Error")} message={hasError.message} />
        ) : isLoading ? (
          <OykLoading />
        ) : characters && characters.length > 0 ? (
          <OykGridRow wrap className="oyk-community-memberlist">
            {characters.map((member) => (
              <OykGridCol key={member.id} col="25" md="50" grow={false}>
                <OykCard nop fullCenter alignSpace clickable className="oyk-community-memberlist-item">
                  <header className="oyk-community-memberlist-item-header">
                    <OykBanner />
                    <div className="oyk-community-memberlist-item-header-name">
                      <span>{member.name}</span>
                    </div>
                    <div className="oyk-community-memberlist-item-header-title">
                      <span>Qui ne fait que passer</span>
                    </div>
                  </header>
                </OykCard>
              </OykGridCol>
            ))}
          </OykGridRow>
        ) : users && users.length > 0 ? (
          <OykGridRow wrap className="oyk-community-memberlist">
            {users.map((member) => (
              <OykGridCol key={member.id} col="25" md="50" grow={false}>
                <OykCard nop fullCenter alignSpace clickable className="oyk-community-memberlist-item">
                  <header className="oyk-community-memberlist-item-header">
                    <OykBanner avatarSrc={member.avatar} avatarShowOnline avatarOnline={member.is_online} avatarLevel={1} coverSrc={member.cover} />
                    <div className="oyk-community-memberlist-item-header-name">
                      <span>{member.name}</span>
                    </div>
                    <div className="oyk-community-memberlist-item-header-title">
                      <span>Qui ne fait que passer</span>
                    </div>
                  </header>
                </OykCard>
              </OykGridCol>
            ))}
          </OykGridRow>
        ) : (
          <OykCard>
            <OykFeedback ghost title={t("No members")} icon={Frown} />
          </OykCard>
        )}
      </OykGrid>
    </section>
  );
}
