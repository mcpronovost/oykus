import { useEffect, useState } from "react";
import { Construction } from "lucide-react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykAlert, OykAvatar, OykFeedback, OykGrid, OykHeading, OykLink, OykLoading } from "@/components/common";

export default function Home() {
  const { t } = useTranslation();

  const [isLoadingWio, setIsLoadingWio] = useState(false);
  const [hasErrorWio, setHasErrorWio] = useState(null);
  const [wioUsers, setWioUsers] = useState([]);
  const [wioGuests, setWioGuests] = useState(0);

  const fetchWio = async (signal) => {
    setIsLoadingWio(true);
    setHasErrorWio(null);
    try {
      const r = await api.get("/wio/", signal ? { signal } : {});
      if (!r?.ok) throw new Error(r.error || t("An error occurred"));
      setWioUsers(r.users);
      setWioGuests(r.guests);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasErrorWio(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      if (!signal.aborted) {
        setIsLoadingWio(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchWio(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="oyk-page oyk-home">
      <OykHeading title={t("Home")} />
      <OykGrid>
        <OykFeedback
          ghost
          title={t("Under Construction")}
          message={t("This page is currently under construction. Please check back later.")}
          icon={Construction}
        />
      </OykGrid>
      <OykHeading title={t("Who is online?")} />
      <OykGrid>
        {hasErrorWio ? (
          <OykAlert
            title={t("An error occurred")}
            message={t("Unable to access who is online data, check your internet connection or try again later")}
            variant="danger"
          />
        ) : !isLoadingWio ? (
          <>
            <section style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
              {wioUsers?.length
                ? wioUsers.map((u) => (
                    <OykLink key={u.slug} routeName={"users-profile"} params={{ userSlug: u.slug }}>
                      <OykAvatar name={u.name} abbr={u.abbr} src={u.avatar} borderSize={6} size={48} />
                    </OykLink>
                  ))
                : null}
              {wioGuests ? (
                <OykAvatar
                  abbr={`+${wioGuests}`}
                  bgColor="transparent"
                  fgColor="var(--oyk-core-fg)"
                  borderColor="transparent"
                  size={48}
                />
              ) : null}
            </section>
          </>
        ) : (
          <OykLoading />
        )}
      </OykGrid>
    </section>
  );
}
