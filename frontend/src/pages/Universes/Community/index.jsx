import "@/assets/styles/page/_community-user-profile.scss";
import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykBanner, OykCard, OykFeedback, OykGrid, OykGridRow, OykGridCol, OykHeading, OykLoading } from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";

export default function OykCommunity() {
  const { params, routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [members, setMembers] = useState(null);

  const fetchMembers = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      // if (!params?.userSlug) throw new Error(t("User doesn't exist"));
      // const r = await api.get(`/auth/users/${params.userSlug}/profile/`, signal ? { signal } : {});
      // if (!r?.ok || !r?.members) throw r;
      // setMembers(r.members);
      setMembers([{name: "Naofu Pillow And The Ninety-Nine Tails"}, {name: "Kamuy"}, {name: "Seðem"}, {name: "Cháo"}, {name: "Tyryn"}]);
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
    fetchMembers(controller.signal);

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
        ) : members ? (
          <>
            {members?.length > 0 ? (
              <OykGridRow wrap className="oyk-community-memberlist">
                {members.map((member) => (
                  <OykGridCol col="25" md="50" grow={false}>
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
            ) : (
              <OykCard>
                <OykFeedback ghost title={t("No members")} icon={Frown} />
              </OykCard>
            )}
          </>
        ) : null}
      </OykGrid>
    </section>
  );
}
