import { Component, Orbit, Settings } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebarFooter() {
  const { isAuth, isDev } = useAuth();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <footer className="oyk-app-sidebar-footer">
      <nav className="oyk-app-sidebar-nav">
        <ul className="oyk-app-sidebar-nav-list">
          {isAuth ? <OykAppSidebarNavItem icon={Settings} text={t("Settings")} href="settings" /> : null}
          {/*isDev ? <OykAppSidebarNavItem icon={Component} text={t("Components")} href="dev-components" /> : null*/}
          {isAuth && currentUniverse && currentUniverse.role === 1 ? (
            <OykAppSidebarNavItem
              icon={Orbit}
              text={t("Admin")}
              href="universe-admin"
              params={{ universeSlug: currentUniverse.slug }}
              prefix="universe-admin"
            />
          ) : null}
        </ul>
      </nav>
    </footer>
  );
}
