import {
  Compass,
  Component,
  GalleryHorizontalEnd,
  House,
  LayoutDashboard,
  ListTodo,
  LoaderPinwheel,
  MessagesSquare,
  Settings,
  Star
} from "lucide-react";
import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { OykScrollbar } from "@/components/ui";
import OykAppSidebarHeader from "./Header";
import OykAppSidebarUser from "./User";
import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebar() {
  const { isAuth, isDev, currentUniverse } = useAuth();
  const { storeAppSidebarOpen } = useStore();
  const { t } = useTranslation();

  return (
    <aside className={`oyk-app-sidebar ${storeAppSidebarOpen ? "open" : ""}`}>
      <OykAppSidebarHeader />
      <OykScrollbar height="100%" className="oyk-app-sidebar-scrollbar">
        <OykAppSidebarUser />
        <section className="oyk-app-sidebar-menu">
          <nav className="oyk-app-sidebar-nav">
            <ul className="oyk-app-sidebar-nav-list">
              <OykAppSidebarNavItem icon={isAuth ? LayoutDashboard : House} text={isAuth ? t("Dashboard") : t("Home")} href="home" />
              <OykAppSidebarNavItem icon={Compass} text={t("Discover")} href="discover" />
              {isAuth && currentUniverse?.is_mod_planner_active ? (<OykAppSidebarNavItem icon={ListTodo} text={t("Planner")} href="planner" />) : null}
              {isAuth && currentUniverse?.is_mod_forum_active ? (<OykAppSidebarNavItem icon={MessagesSquare} text={t("Forum")} href="forum" disabled />) : null}
              {isAuth && currentUniverse?.is_mod_collectibles_active ? (<OykAppSidebarNavItem icon={GalleryHorizontalEnd} text={t("Collectibles")} href="collectibles" disabled />) : null}
              {isAuth && currentUniverse?.is_mod_rewards_active ? (<OykAppSidebarNavItem icon={Star} text={t("Achievements")} href="achievements" />) : null}
            </ul>
          </nav>
        </section>
        <footer className="oyk-app-sidebar-footer">
          <nav className="oyk-app-sidebar-nav">
            <ul className="oyk-app-sidebar-nav-list">
              {isAuth ? (<OykAppSidebarNavItem icon={Settings} text={t("Settings")} href="settings" />) : null}
              {isDev ? (<OykAppSidebarNavItem icon={Component} text={t("Components")} href="dev-components" />) : null}
              {isAuth && currentUniverse ? (<OykAppSidebarNavItem icon={LoaderPinwheel} text={t("Admin")} href="universe-admin" params={ { universeSlug: currentUniverse.slug }} />) : null}
            </ul>
          </nav>
        </footer>
      </OykScrollbar>
    </aside>
  );
}
