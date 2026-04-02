// import "@/assets/styles/modules/_collections.scss";
import { useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import { OykAvatar, OykBanner, OykCard, OykGrid, OykGridRow, OykGridCol, OykHeading, OykLink } from "@/components/ui";

export default function OykUniverseGame() {
  const { isAuth, currentUser } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const testTopics = [1, 2, 3, 4, 5];
  const testTopicsModulo = testTopics.length % 4;
  const testMessages = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (!currentUniverse || (currentUniverse && !currentUniverse.modules?.game?.active)) return;
    const controller = new AbortController();

    routeTitle(currentUniverse.modules.game.settings.display_name || t("Game"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

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
      <section className="oyk-game-sections">
        <OykHeading title="Sections" />
        <OykGrid>
          <OykGridRow wrap>
            <OykGridCol col="50">
              <OykCard fullCenter alignSpace nop>
                <header>
                  <OykBanner height={100} showAvatar={false} coverSrc={currentUser.cover} />
                  <h3 style={{ padding: "8px 16px 0" }}>
                    <OykLink block>Layuan</OykLink>
                  </h3>
                  <p>Lorem ipsum dolor sit amet.</p>
                </header>
              </OykCard>
            </OykGridCol>
            <OykGridCol col="50">
              <OykCard fullCenter alignSpace nop>
                <header>
                  <OykBanner height={100} showAvatar={false} coverSrc={currentUser.avatar} />
                  <h3 style={{ padding: "8px" }}>
                    <OykLink block>Espace Tuan</OykLink>
                  </h3>
                </header>
              </OykCard>
            </OykGridCol>
            <OykGridCol col="25">
              <OykCard fullCenter>ddd</OykCard>
            </OykGridCol>
            <OykGridCol col="25">
              <OykCard fullCenter>eee</OykCard>
            </OykGridCol>
          </OykGridRow>
        </OykGrid>
      </section>
      <section className="oyk-game-topics">
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
      </section>
    </section>
  );
}
