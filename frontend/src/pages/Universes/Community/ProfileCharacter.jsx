import "@/assets/styles/page/_community-user-profile.scss";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykBanner, OykCard, OykFeedback, OykGrid, OykGridRow, OykGridCol } from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";

export default function CommunityProfile() {
  const { params, routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      if (!params?.characterSlug) throw { error: t("Character not found") };
      const r = await api.get(
        `/world/universes/${params.universeSlug}/community/${params.characterSlug}/`,
        signal ? { signal } : {},
      );
      if (!r?.ok || !r?.character) throw r;
      setUserData(r.character);
      routeTitle(r.character.name);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: t(e.error) || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchUserData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, [params]);

  return (
    <section className="oyk-page oyk-characterprofile">
      <OykGrid>
        {hasError && hasError.message == 401 ? (
          <OykAppNotAuthorized />
        ) : hasError ? (
          <OykFeedback ghost variant="danger" title={t("Error")} message={hasError.message} />
        ) : userData && !isLoading ? (
          <OykGridRow>
            <OykGridCol col="25" md="100" sm="100">
              <OykCard nop>
                <OykBanner
                  avatarSrc={userData.avatar}
                  avatarSize={140}
                  avatarTop={64}
                  avatarBorderSize={8}
                  coverSrc={userData.cover}
                  coverHeight={144}
                  height={224}
                />
                <section className="oyk-characterprofile-identity">
                  <h1 className="oyk-characterprofile-identity-name">{userData.name}</h1>
                  <small className="oyk-characterprofile-identity-title">Qui ne fait que passer</small>
                </section>
              </OykCard>
            </OykGridCol>
            <OykGridCol col="75" md="100" sm="100">
              <OykCard nop>
                <OykBanner
                  showAvatar={false}
                  coverSrc={userData.cover}
                  coverHeight={144}
                  height={224}
                />
                <section className="oyk-characterprofile-identity">
                  {t("Under construction")}
                </section>
              </OykCard>
            </OykGridCol>
          </OykGridRow>
        ) : null}
      </OykGrid>
    </section>
  );
}
