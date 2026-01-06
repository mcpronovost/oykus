import {
  Blocks,
  Compass,
  Earth,
  LayoutDashboard,
  LibraryBig,
  ListTodo,
  Settings,
  ShieldAlert,
  Users,
  LifeBuoy,
  Pickaxe,
} from "lucide-react";

import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";

import OykSidebarHeader from "./SidebarHeader";
import OykNavItem from "./NavItem";

export default function AppSidebar() {
  const { currentUser, storeAppSidebarOpen, currentWorld } = useStore();
  const { t } = useTranslation();

  return (
    <aside className={`oyk-app-sidebar ${storeAppSidebarOpen ? "open" : ""}`}>
      <OykSidebarHeader />
      <section className="oyk-app-sidebar-menu">
        <nav className="oyk-app-sidebar-nav">
          {!currentWorld && (
            <ul className="oyk-app-sidebar-nav-list">
              <OykNavItem icon={LayoutDashboard} text={t("Dashboard")} href="home" />
              <OykNavItem icon={Compass} text={t("Discover")} href="discover" />
            </ul>
          )}
          {currentUser && currentWorld && (
            <ul className="oyk-app-sidebar-nav-list">
              <OykNavItem icon={LayoutDashboard} text={t("Dashboard")} href="home" />
              <OykNavItem icon={ListTodo} text={t("Tasks")} href="tasks" />
            </ul>
          )}
          {currentWorld && (
            <ul className="oyk-app-sidebar-nav-list">
              <OykNavItem
                icon={ShieldAlert}
                text={t("Rulebook")}
                href="world-rulebook"
                params={{ worldSlug: currentWorld.slug }}
              />
              <OykNavItem
                icon={LibraryBig}
                text={t("Lore")}
                href="world-lore"
                params={{ worldSlug: currentWorld.slug }}
                disabled
              />
              <OykNavItem
                icon={Earth}
                text={t("World")}
                href="world-home"
                params={{ worldSlug: currentWorld.slug }}
              />
              <OykNavItem
                icon={Users}
                text={t("Community")}
                href="world-community"
                params={{ worldSlug: currentWorld.slug }}
                disabled
              />
              <OykNavItem
                icon={LifeBuoy}
                text={t("Support")}
                href="world-support"
                params={{ worldSlug: currentWorld.slug }}
              />
            </ul>
          )}
        </nav>
      </section>
      <footer className="oyk-app-sidebar-footer">
        <nav className="oyk-app-sidebar-nav">
          <ul className="oyk-app-sidebar-nav-list">
            <OykNavItem icon={Settings} text={t("Settings")} href="settings" />
            <OykNavItem icon={Blocks} text={t("Components")} href="dev-components" />
            <OykNavItem icon={Pickaxe} text={t("Quests")} href="dev-quests" />
          </ul>
        </nav>
      </footer>
    </aside>
  );
}
