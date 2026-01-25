import "@/assets/styles/page/_users-profile.scss";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykBanner, OykCard, OykFeedback, OykGrid } from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";

export default function UserProfile() {
  const { params, routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      if (!params?.userSlug) throw new Error(t("User doesn't exist"));
      const r = await api.get(`/auth/users/${params.userSlug}/profile/`, signal ? { signal } : {});
      if (!r?.ok || !r?.user) throw new Error(r.error || t("User doesn't exist"));
      setUserData(r.user);
      routeTitle(r.user.name);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: e.message || t("An error occurred")
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    fetchUserData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, [params]);

  return (
    <section className="oyk-page oyk-userprofile">
      <OykGrid>
        {(hasError && hasError.message == 401) ? (
          <OykAppNotAuthorized />
        ) : hasError ? (
          <OykFeedback ghost variant="danger" title={t("Error")} message={hasError.message} />
        ) : (userData && !isLoading) ? (
          <>
            <OykCard nop>
              <OykBanner avatarSrc={userData.avatar} avatarSize={200} avatarTop={90} avatarBorderSize={8} coverSrc={userData.cover} coverHeight={256} height={298} />
              <section className="oyk-userprofile-identity">
                <h1 className="oyk-userprofile-identity-name">{userData.name}</h1>
                <small className="oyk-userprofile-identity-title">Qui ne fait que passer</small>
              </section>
            </OykCard>
          </>
        ) : null}
      </OykGrid>
    </section>
  );
}
