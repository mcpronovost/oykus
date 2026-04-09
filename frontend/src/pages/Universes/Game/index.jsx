import { useEffect, useState } from "react";

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
import OykUniverseGameZoneSectorCard from "./World/ZoneSectorCard";

export default function OykUniverseGame() {
  const { isAuth, currentUser } = useAuth();
  const { route, params, routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [geo, setGeo] = useState([]);

  const testTopics = [1, 2, 3, 4, 5];
  const testTopicsModulo = testTopics.length % 4;
  const testMessages = [1, 2, 3, 4, 5];

  const fetchGameData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/game/u/${params.universeSlug}/`, signal ? { signal } : {});
      if (!r.ok || !r.geo) throw r;
      setGeo(r.geo);
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
    fetchGameData();

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
      <header id="oyk-game-header">
        <OykGrid id="oyk-game-header-wrapper">
          <OykCard nop fullCenter>
            <OykBanner height={256} showAvatar={false} coverSrc={currentUniverse.cover} coverHeight={256} />
          </OykCard>
        </OykGrid>
        <h1 id="oyk-game-header-logo">
          <OykLink routeName="universe-game" params={{ universeSlug: currentUniverse.slug }}>
            {currentUniverse.name}
          </OykLink>
        </h1>
        {currentUniverse.tagline && <p>{currentUniverse.tagline}</p>}
      </header>
      {!hasError && isLoading ? (
        <OykLoading />
      ) : !hasError ? (
        <>
          {geo?.length > 0 ? (
            <section className="oyk-game-zones">
              {geo.map((zone) => (
                <article key={zone.id} className="oyk-game-zone">
                  <OykHeading
                    title={zone.name}
                    titleLink={{
                      routeName: "universe-game-zone",
                      params: {
                        universeSlug: currentUniverse.slug,
                        zoneId: zone.id,
                      },
                    }}
                  />
                  <OykGrid>
                    {zone.sectors?.length > 0 ? (
                      <OykGridRow wrap className="oyk-game-zone-sectors">
                        {zone.sectors.map((sector) => (
                          <OykGridCol key={sector.id} col={sector.col}>
                            <OykUniverseGameZoneSectorCard universe={currentUniverse} zone={zone} sector={sector} />
                          </OykGridCol>
                        ))}
                      </OykGridRow>
                    ) : (
                      <OykFeedback title={t("This zone is empty")} showIcon={false} ghost />
                    )}
                  </OykGrid>
                </article>
              ))}
            </section>
          ) : (
            <OykGrid>
              <OykFeedback title={t("The world is empty")} ghost />
            </OykGrid>
          )}
        </>
      ) : (
        <OykGrid>
          <OykFeedback title={hasError || t("An error occurred")} />
        </OykGrid>
      )}
      {/*<section className="oyk-game-topics">
        <OykHeading title="Topics" />
        <OykGrid>
          <OykGridRow wrap>
            {testTopics.map((t, index) => (
              <OykGridCol
                col={
                  testTopicsModulo === 3 && index < 3
                    ? "33"
                    : testTopicsModulo === 2 && index < 2
                      ? "50"
                      : testTopicsModulo === 1 && index < 1
                        ? "100"
                        : "25"
                }
                md={(testTopicsModulo === 1 || testTopicsModulo === 3) && index < 1 ? "100" : "50"}
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
        </OykGrid>
      </section>
      <section className="oyk-game-messages">
        <OykHeading title="Messages" />
        <OykGrid>
          <OykGridRow wrap>
            {testMessages.map((m, index) => (
              <OykGridCol col="100">
                <OykCard nop>
                  <header style={{ textAlign: "center" }}>
                    <OykBanner
                      height={190}
                      avatarSrc={currentUser.avatar}
                      avatarSize={180}
                      avatarBorderSize={12}
                      avatarTop={-14}
                      coverSrc={currentUser.cover}
                      coverHeight={156}
                    />
                    <h3
                      style={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: "2.2rem",
                        fontWeight: "400",
                        lineHeight: "1.2",
                        padding: "0 16px 16px",
                      }}
                    >
                      {currentUser.name}
                    </h3>
                  </header>
                </OykCard>
              </OykGridCol>
            ))}
          </OykGridRow>
        </OykGrid>
      </section>*/}
    </section>
  );
}
