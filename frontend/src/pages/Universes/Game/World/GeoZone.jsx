import { useEffect, useState } from "react";
import { Frown } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import {
  OykAvatar,
  OykBanner,
  OykCard,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridCol,
  OykHeading,
  OykLink,
  OykLoading,
} from "@/components/ui";
import { OykGameHeader } from "@/components/common";
import OykUniverseGameSectorCard from "./SectorCard";

export default function OykUniverseGameZone() {
  const { isAuth, currentUser } = useAuth();
  const { route, params, routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [zone, setZone] = useState(null);

  const fetchZoneData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/game/u/${params.universeSlug}/zones/${params.zoneId}/`, signal ? { signal } : {});
      if (!r.ok || !r.zone) throw r;
      routeTitle(r.zone.name);
      setZone(r.zone);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(t(e?.error) || t("An error occurred"));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!currentUniverse || (currentUniverse && !currentUniverse.modules?.game?.active)) return;
    const controller = new AbortController();

    fetchZoneData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, [params]);

  if (!currentUniverse || (currentUniverse && !currentUniverse.modules?.game?.active)) {
    return <AppNotAuthorized />;
  }

  return (
    <section className="oyk-game">
      <OykGameHeader game={currentUniverse} />
      {!hasError && isLoading ? (
        <OykLoading />
      ) : !hasError ? (
        <>
          <article className="oyk-game-zone">
            <OykHeading title={zone.name} showBreadcrumbs />
            <OykGrid>
              {zone.sectors?.length > 0 ? (
                <OykGridRow wrap className="oyk-game-zone-sectors">
                  {zone.sectors.map((sector) => (
                    <OykGridCol key={sector.id} col={sector.col}>
                      <OykUniverseGameSectorCard universe={currentUniverse} zone={zone} sector={sector} />
                    </OykGridCol>
                  ))}
                </OykGridRow>
              ) : (
                <OykFeedback title={t("This zone is empty")} showIcon={false} ghost />
              )}
            </OykGrid>
          </article>
        </>
      ) : (
        <OykGrid>
          <OykFeedback title={hasError || t("An error occurred")} />
        </OykGrid>
      )}
    </section>
  );
}
