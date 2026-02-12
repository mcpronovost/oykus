import {
  Compass,
  Component,
  GalleryHorizontalEnd,
  House,
  LayoutDashboard,
  ListTodo,
  LoaderPinwheel,
  MessagesSquare,
  ScrollText,
  Settings,
  Star,
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
              <OykAppSidebarNavItem
                icon={isAuth ? LayoutDashboard : House}
                text={isAuth ? t("Dashboard") : t("Home")}
                href="home"
              />
              <OykAppSidebarNavItem icon={Compass} text={t("Discover")} href="discover" />
            </ul>
            {isAuth && currentUniverse && currentUniverse.modules ? (
              <ul className="oyk-app-sidebar-nav-list">
                {currentUniverse.modules?.planner?.active ? (
                  <OykAppSidebarNavItem
                    icon={ListTodo}
                    text={currentUniverse.modules.planner.settings.display_name || t("Planner")}
                    href="planner"
                  />
                ) : null}
                {currentUniverse.modules?.blog?.active ? (
                  <OykAppSidebarNavItem
                    icon={ScrollText}
                    text={currentUniverse.modules.blog.settings.display_name || t("Blog")}
                    href="blog"
                    disabled
                  />
                ) : null}
                {currentUniverse.modules?.forum?.active ? (
                  <OykAppSidebarNavItem icon={MessagesSquare} text={t("Forum")} href="forum" disabled />
                ) : null}
                {currentUniverse.modules?.collectibles?.active ? (
                  <OykAppSidebarNavItem
                    icon={GalleryHorizontalEnd}
                    text={t("Collectibles")}
                    href="collectibles"
                    disabled
                  />
                ) : null}
                {currentUniverse.modules?.rewards?.active ? (
                  <OykAppSidebarNavItem icon={Star} text={t("Achievements")} href="achievements" />
                ) : null}
              </ul>
            ) : null}
          </nav>
        </section>
        <footer className="oyk-app-sidebar-footer">
          <nav className="oyk-app-sidebar-nav">
            <ul className="oyk-app-sidebar-nav-list">
              {isAuth ? <OykAppSidebarNavItem icon={Settings} text={t("Settings")} href="settings" /> : null}
              {isDev ? <OykAppSidebarNavItem icon={Component} text={t("Components")} href="dev-components" /> : null}
              {isAuth && currentUniverse && currentUniverse.role === 1 ? (
                <OykAppSidebarNavItem
                  icon={LoaderPinwheel}
                  text={t("Admin")}
                  href="universe-admin"
                  params={{ universeSlug: currentUniverse.slug }}
                />
              ) : null}
            </ul>
          </nav>
        </footer>
      </OykScrollbar>
    </aside>
  );
}
