import { Component, Orbit, Settings } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykCoreNavbarNavItem from "./NavItem";

export default function CoreNavbarFooter() {
  const { isAuth, isDev } = useAuth();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <footer className="oyk-core-navbar-footer">
      <nav className="oyk-core-navbar-nav">
        <ul className="oyk-core-navbar-nav-list">
          {/*isDev ? <OykCoreNavbarNavItem icon={Component} text={t("Components")} href="dev-components" /> : null*/}
          {isAuth && currentUniverse && currentUniverse.role === 1 ? (
            <OykCoreNavbarNavItem
              icon={Orbit}
              text={t("Admin")}
              href="universe-admin"
              params={{ universeSlug: currentUniverse.slug }}
              prefix="universe-admin"
            />
          ) : null}
          {isAuth ? <OykCoreNavbarNavItem icon={Settings} text={t("Settings")} href="settings" /> : null}
        </ul>
      </nav>
    </footer>
  );
}
