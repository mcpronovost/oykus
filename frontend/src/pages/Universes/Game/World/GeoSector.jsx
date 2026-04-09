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

export default function OykUniverseGame() {
  const { isAuth, currentUser } = useAuth();
  const { route, params, routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [sector, setSector] = useState(null);
  const [chaptersModulo, setChaptersModulo] = useState(0);

  const fetchSectorData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/game/u/${params.universeSlug}/sectors/${params.sectorId}/`, signal ? { signal } : {});
      if (!r.ok || !r.sector) throw r;
      setSector(r.sector);
      if (r.sector.chapters) setChaptersModulo(r.sector.chapters.length % 4);
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

    routeTitle(currentUniverse.modules.game.settings.display_name || t("Game"));
    fetchSectorData();

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
          <article className="oyk-game-sector">
            <OykHeading title={sector.name} description={sector.description} showBreadcrumbs />
            <OykGrid>
              {sector.chapters?.length > 0 ? (
                <OykGridRow wrap>
                  {sector.chapters?.map((t, index) => (
                    <OykGridCol
                      col={
                        chaptersModulo === 3 && index < 3
                          ? "33"
                          : chaptersModulo === 2 && index < 2
                            ? "50"
                            : chaptersModulo === 1 && index < 1
                              ? "100"
                              : "25"
                      }
                      md={(chaptersModulo === 1 || chaptersModulo === 3) && index < 1 ? "100" : "50"}
                    >
                      <OykCard fullCenter alignSpace nop>
                        <header>
                          <OykBanner
                            height={104}
                            avatarSrc={currentUser.avatar}
                            avatarSize={100}
                            avatarBorderSize={8}
                            avatarTop={-10}
                            coverSrc={index === 1 ? currentUser.cover : currentUser.avatar}
                            coverHeight={82}
                            coverFilter="author"
                          />
                          <small style={{ opacity: 0.6 }}>3 novembre 1989</small>
                        </header>
                        <h3
                          style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            lineHeight: "1.2",
                            padding: "8px",
                          }}
                        >
                          {index === 1 ? "Le succès est doux mais il a, d'ordinaire, une odeur de sueur" : "AAA"}
                        </h3>
                        <footer>(footer)</footer>
                      </OykCard>
                    </OykGridCol>
                  ))}
                </OykGridRow>
              ) : (
                <OykFeedback title={t("This sector is empty")} showIcon={false} ghost />
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
