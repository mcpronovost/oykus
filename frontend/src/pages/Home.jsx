import "@/assets/styles/page/home.scss";
import { useEffect, useState } from "react";
import { Component, MessagesSquare, Share2 } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykCard, OykFeedback, OykGrid, OykGridRow, OykGridCol, OykHeading } from "@/components/ui";
import { OykWIO } from "@/components/common";

export default function Home() {
  const { params } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse, changeUniverse } = useWorld();

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

    if (params?.universeSlug && params?.universeSlug !== currentUniverse?.slug) {
      changeUniverse(params.universeSlug);
    }
    fetchWio(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="oyk-page oyk-home">
      <OykHeading title={currentUniverse?.name || "Oykus"} />
      {!currentUniverse || currentUniverse?.is_default ? (
        <OykGrid className="oyk-home-intro">
          <p>
            {t(
              "At the heart of Oykus is the idea that each universe, as unique as it may be, can resonate with others. Worlds are not isolated: they intersect, collide, and influence each other",
            )}
          </p>
        </OykGrid>
      ) : null}
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
      {!currentUniverse || currentUniverse?.is_default ? (
        <OykGrid className="oyk-home-features">
          <OykGridRow wrap>
            <OykGridCol col="33" md="50" sm="100">
              <OykCard fh alignSpace>
                <header>
                  <Share2 size={24} color="var(--oyk-c-primary)" />
                  <h2>{t("A Living and Interconnected Multiverse")}</h2>
                </header>
                <p>
                  {t(
                    "A collaborative multiverse project designed to reinvent the way role-playing game universes are created, shared, and experienced",
                  )}
                </p>
              </OykCard>
            </OykGridCol>
            <OykGridCol col="12" md="50" sm="100">
              <OykCard fh alignSpace>
                <header>
                  <MessagesSquare size={24} color="var(--oyk-c-primary)" />
                  <h2>{t("Modernising Forum Role-Playing")}</h2>
                </header>
                <p>
                  {t(
                    "A modern, elegant, and flexible space where each creator can shape their own world, define its rules, lore, and history",
                  )}
                </p>
              </OykCard>
            </OykGridCol>
            <OykGridCol col="22" md="50" sm="100">
              <OykCard fh alignSpace>
                <header>
                  <Component size={24} color="var(--oyk-c-primary)" />
                  <h2>{t("Tools to Shape Your Universe")}</h2>
                </header>
                <p>
                  {t(
                    "Tools designed to streamline writing and roleplay management; a series of modules designed to enrich and structure each world",
                  )}
                </p>
              </OykCard>
            </OykGridCol>
          </OykGridRow>
        </OykGrid>
      ) : null}
      <OykWIO users={wioUsers} guests={wioGuests} isLoading={isLoadingWio} hasError={hasErrorWio} />
    </section>
  );
}
