import "@/assets/styles/page/_users-profile.scss";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykBanner, OykCard, OykFeedback, OykGrid } from "@/components/common";

export default function UserProfile() {
  const { params } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      if (!params?.userSlug) throw new Error(t("User doesn't exist"));
      const r = await api.get(`/auth/users/${params.userSlug}/profile/`, { signal });
      if (!r?.ok || !r?.user) throw new Error(r.error || t("User doesn't exist"));
      setUserData(r.user);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: e.message || t("An error occurred")
      }));
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    fetchUserData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [params]);

  return (
    <section className="oyk-page oyk-userprofile">
      <OykGrid>
        {(userData && !isLoading && !hasError) ? (
          <>
            <OykCard nop>
              <OykBanner avatarSrc={userData.avatar} avatarSize={200} avatarTop={90} avatarBorderSize={8} coverSrc={userData.cover} coverHeight={256} height={298} />
              <section className="oyk-userprofile-identity">
                <h1 className="oyk-userprofile-identity-name">{userData.name}</h1>
                <small className="oyk-userprofile-identity-title">Qui ne fait que passer</small>
              </section>
            </OykCard>
          </>
        ) : hasError ? (
          <OykFeedback ghost variant="danger" title={t("Error")} message={hasError.message} />
        ) : null}
      </OykGrid>
    </section>
  );
}
