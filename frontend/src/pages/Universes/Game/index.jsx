// import "@/assets/styles/modules/_collections.scss";
import { useEffect } from "react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import { OykAlert, OykBanner, OykCard, OykGrid, OykHeading } from "@/components/ui";

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
      <header>
        <OykGrid>
          <OykCard nop fullCenter>
            <OykBanner
              height={328}
              avatarSrc={currentUniverse.logo}
              avatarSize={128}
              avatarBorderRadius="4px"
              avatarTop={180}
              coverSrc={currentUniverse.cover}
              coverHeight={256}
            />
            <h1>{currentUniverse.name}</h1>
          </OykCard>
        </OykGrid>
      </header>
    </section>
  );
}
