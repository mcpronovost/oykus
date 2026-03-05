import { Compass, House, LayoutDashboard, MessagesSquare } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebarMenuMain() {
  const { isAuth } = useAuth();
  const { t } = useTranslation();
  const { currentUniverse, currentCharacter } = useWorld();

  return (
    <ul className="oyk-app-sidebar-nav-list">
      <OykAppSidebarNavItem
        icon={isAuth ? LayoutDashboard : House}
        text={isAuth ? t("Dashboard") : t("Home")}
        href={isAuth ? (!currentUniverse || currentUniverse.is_default ? "dashboard" : "universe") : "home"}
        params={{ universeSlug: currentUniverse?.slug }}
      />
      {!currentUniverse || currentUniverse.is_default ? (
        <OykAppSidebarNavItem icon={Compass} text={t("Discover")} href="discover" />
      ) : null}
      {currentUniverse && !currentUniverse.is_default && currentUniverse.modules?.forum?.active ? (
        <OykAppSidebarNavItem icon={MessagesSquare} text={t("Forum")} href="forum" />
      ) : null}
    </ul>
  );
}
