import "@/assets/styles/page/home.scss";
import { useEffect, useState } from "react";
import { Component, MessagesSquare, Share2 } from "lucide-react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import {
  OykAlert,
  OykAvatar,
  OykCard,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridCol,
  OykHeading,
  OykLink,
  OykLoading,
} from "@/components/ui";

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
      const r = await api.get("/auth/wio/", signal ? { signal } : {});
      if (!r?.ok) throw new Error(r.error || t("An error occurred"));
      setWioUsers(r.users);
      setWioGuests(r.guests);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasErrorWio(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
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
      <OykHeading title={t("Oykus")} />
      <OykGrid className="oyk-home-intro">
        <p>
          {t(
            "At the heart of Oykus is the idea that each universe, as unique as it may be, can resonate with others. Worlds are not isolated: they intersect, collide, and influence each other",
          )}
        </p>
      </OykGrid>
      <OykGrid>
        <OykFeedback
          title={t("Under Active Development")}
          message={t(
            "Oykus is a collaborative multiverse project designed to reinvent the way role-playing game universes are created, shared, and experienced",
          )}
          ghost
          showIcon={false}
          variant="primary"
        />
      </OykGrid>
      <OykGrid className="oyk-home-features">
        <OykGridRow wrap>
          <OykGridCol col="33" md="50" sm="100">
            <OykCard fh alignSpace>
              <header>
                <Share2 size={24} color="var(--oyk-c-primary)" />
                <h2>{t("A Living and Interconnected Multiverse")}</h2>
              </header>
              <p>{t("A collaborative multiverse project designed to reinvent the way role-playing game universes are created, shared, and experienced")}</p>
            </OykCard>
          </OykGridCol>
          <OykGridCol col="12" md="50" sm="100">
            <OykCard fh alignSpace>
              <header>
                <MessagesSquare size={24} color="var(--oyk-c-primary)" />
                <h2>{t("Modernising Forum Role-Playing")}</h2>
              </header>
              <p>{t("A modern, elegant, and flexible space where each creator can shape their own world, define its rules, lore, and history")}</p>
            </OykCard>
          </OykGridCol>
          <OykGridCol col="22" md="50" sm="100">
            <OykCard fh alignSpace>
              <header>
                <Component size={24} color="var(--oyk-c-primary)" />
                <h2>{t("Tools to Shape Your Universe")}</h2>
              </header>
              <p>{t("Tools designed to streamline writing and roleplay management; a series of modules designed to enrich and structure each world")}</p>
            </OykCard>
          </OykGridCol>
        </OykGridRow>
      </OykGrid>
      <OykHeading title={t("Who is online?")} tag="h2" subtitle />
      <OykGrid>
        {hasErrorWio ? (
          <OykAlert
            title={t("An error occurred")}
            message={t("Unable to access who is online data, check your internet connection or try again later")}
            variant="danger"
          />
        ) : !isLoadingWio ? (
          <>
            <section style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              {wioUsers?.length
                ? wioUsers.map((u) => (
                    <OykLink key={u.slug} routeName={"community-user-profile"} params={{ userSlug: u.slug }}>
                      <OykAvatar name={u.name} abbr={u.abbr} src={u.avatar} borderSize={6} size={48} />
                    </OykLink>
                  ))
                : null}
              {wioGuests ? (
                <OykAvatar abbr={`+${wioGuests}`} bgColor="var(--oyk-card-bg)" fgColor="var(--oyk-card-fg)" size={32} />
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
