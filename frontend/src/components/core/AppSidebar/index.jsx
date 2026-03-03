import {
  BookOpen,
  Compass,
  Component,
  GalleryHorizontalEnd,
  House,
  LayoutDashboard,
  ListTodo,
  LoaderPinwheel,
  MessagesSquare,
  Orbit,
  ScrollText,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykScrollbar } from "@/components/ui";

import OykAppSidebarHeader from "./Header";
import OykAppSidebarUser from "./User";
import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebar() {
  const { isAuth, isDev } = useAuth();
  const { storeAppSidebarOpen } = useStore();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <aside className={`oyk-app-sidebar ${storeAppSidebarOpen ? "open" : ""}`}>
      <OykAppSidebarHeader />
      <OykScrollbar height="100%" className="oyk-app-sidebar-scrollbar">
        <OykAppSidebarUser />
        <section className="oyk-app-sidebar-menu">
          <nav className="oyk-app-sidebar-nav">
            <ul className="oyk-app-sidebar-nav-list">
              <OykAppSidebarNavItem
                icon={isAuth ? LayoutDashboard : House}
                text={isAuth ? t("Dashboard") : t("Home")}
                href={isAuth ? "dashboard" : "home"}
              />
              <OykAppSidebarNavItem icon={Compass} text={t("Discover")} href="discover" />
            </ul>
            {isAuth && currentUniverse ? (
              <ul className="oyk-app-sidebar-nav-list">
                <OykAppSidebarNavItem
                  icon={BookOpen}
                  text={t("Rulebooks")}
                  href="rulebooks"
                  params={{ universeSlug: currentUniverse.slug }}
                />
                {currentUniverse.modules?.forum?.active ? (
                  <OykAppSidebarNavItem icon={MessagesSquare} text={t("Forum")} href="forum" />
                ) : null}
                <OykAppSidebarNavItem
                  icon={Users}
                  text={t("Community")}
                  href="community"
                  params={{ universeSlug: currentUniverse.slug }}
                />
              </ul>
            ) : null}
          </nav>
        </section>
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
      </OykScrollbar>
    </aside>
  );
}
