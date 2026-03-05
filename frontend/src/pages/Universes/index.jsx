import "@/assets/styles/page/home.scss";
import { useEffect, useState } from "react";
import { Component, MessagesSquare, Share2 } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykCard, OykFeedback, OykGrid, OykGridRow, OykGridCol, OykHeading } from "@/components/ui";
import { OykWIO } from "@/components/common";

export default function Universe() {
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
      <OykWIO users={wioUsers} guests={wioGuests} isLoading={isLoadingWio} hasError={hasErrorWio} />
    </section>
  );
}
