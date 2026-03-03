import { Compass, House, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";

import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebarMenuMain() {
  const { isAuth } = useAuth();
  const { t } = useTranslation();

  return (
    <ul className="oyk-app-sidebar-nav-list">
      <OykAppSidebarNavItem
        icon={isAuth ? LayoutDashboard : House}
        text={isAuth ? t("Dashboard") : t("Home")}
        href={isAuth ? "dashboard" : "home"}
      />
      <OykAppSidebarNavItem icon={Compass} text={t("Discover")} href="discover" />
    </ul>
  );
}
