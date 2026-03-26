import { Compass, House, LayoutDashboard, Earth } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebarMenuMain() {
  const { isAuth } = useAuth();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <ul className="oyk-app-sidebar-nav-list">
      <OykAppSidebarNavItem
        icon={isAuth ? LayoutDashboard : House}
        text={isAuth ? t("Dashboard") : t("Home")}
        href={!currentUniverse || currentUniverse.is_default ? "dashboard" : "universe"}
        params={{ universeSlug: currentUniverse?.slug }}
      />
      {!isAuth || !currentUniverse || currentUniverse.is_default ? (
        <OykAppSidebarNavItem icon={Compass} text={t("Discover")} href="discover" />
      ) : null}
      {currentUniverse && !currentUniverse.is_default && currentUniverse.modules?.game?.active ? (
        <OykAppSidebarNavItem
          icon={Earth}
          text={currentUniverse.modules.game.settings.display_name || t("Game")}
          href="universe-game"
          params={{ universeSlug: currentUniverse.slug }}
        />
      ) : null}
    </ul>
  );
}
