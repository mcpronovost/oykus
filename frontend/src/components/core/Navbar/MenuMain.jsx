import { Compass, House, LayoutDashboard, Earth } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykCoreNavbarNavItem from "./NavItem";

export default function CoreNavbarMenuMain() {
  const { isAuth } = useAuth();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <ul className="oyk-core-navbar-nav-list">
      <OykCoreNavbarNavItem
        icon={isAuth ? LayoutDashboard : House}
        text={t("Home")}
        href={!currentUniverse || currentUniverse.is_default ? "dashboard" : "universe"}
        params={{ universeSlug: currentUniverse?.slug }}
      />
      {!isAuth || !currentUniverse || currentUniverse.is_default ? (
        <OykCoreNavbarNavItem icon={Compass} text={t("Discover")} href="discover" />
      ) : null}
      {currentUniverse && !currentUniverse.is_default && currentUniverse.modules?.game?.active ? (
        <OykCoreNavbarNavItem
          icon={Earth}
          text={currentUniverse.modules.game.settings.display_name || t("Game")}
          href="universe-game"
          params={{ universeSlug: currentUniverse.slug }}
        />
      ) : null}
    </ul>
  );
}
