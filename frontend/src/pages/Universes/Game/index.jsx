// import "@/assets/styles/modules/_collections.scss";
import { useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import { OykAlert, OykBanner, OykCard, OykGrid, OykGridRow, OykGridCol, OykHeading, OykLink } from "@/components/ui";

export default function OykUniverseGame() {
  const { isAuth } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

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
        {currentUniverse.tagline && (<p>{currentUniverse.tagline}</p>)}
      </header>
      <section>
        <OykGrid>
          <OykGridRow wrap>
            <OykGridCol>
              <OykCard>aaa</OykCard>
            </OykGridCol>
            <OykGridCol col="25">
              <OykCard>bbb</OykCard>
            </OykGridCol>
            <OykGridCol col="25">
              <OykCard>ccc</OykCard>
            </OykGridCol>
            <OykGridCol col="25">
              <OykCard>ddd</OykCard>
            </OykGridCol>
            <OykGridCol col="25">
              <OykCard>eee</OykCard>
            </OykGridCol>
          </OykGridRow>
        </OykGrid>
      </section>
    </section>
  );
}
