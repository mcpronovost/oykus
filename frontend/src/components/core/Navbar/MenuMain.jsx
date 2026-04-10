import { Compass, House, LayoutDashboard, Earth, Orbit } from "lucide-react";

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
      {!currentUniverse || currentUniverse.is_default ? (
        <OykCoreNavbarNavItem icon={House} text={t("Home")} href={"home"} />
      ) : isAuth && currentUniverse.role === 1 ? (
        <OykCoreNavbarNavItem
          icon={LayoutDashboard}
          text={t("Dashboard")}
          href={"universe-dashboard"}
          params={{ universeSlug: currentUniverse.slug }}
        />
      ) : null}
      {!isAuth || !currentUniverse || currentUniverse.is_default ? (
        <OykCoreNavbarNavItem icon={Compass} text={t("Discover")} href="discover" />
      ) : null}
      {currentUniverse?.is_default ? (
        <OykCoreNavbarNavItem icon={Orbit} text={t("Create a World")} href="create-world" />
      ) : null}
      {currentUniverse && !currentUniverse.is_default && currentUniverse.modules?.game?.active ? (
        <OykCoreNavbarNavItem
          icon={Earth}
          text={currentUniverse.modules.game.settings.display_name || t("Game")}
          href="universe"
          params={{ universeSlug: currentUniverse.slug }}
          prefix="universe"
        />
      ) : null}
    </ul>
  );
}
