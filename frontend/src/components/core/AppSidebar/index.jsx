import {
  Blocks,
  Compass,
  LayoutDashboard,
  ListTodo,
  Settings,
} from "lucide-react";
import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { OykScrollbar } from "@/components/common";
import OykAppSidebarHeader from "./Header";
import OykAppSidebarUser from "./User";
import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebar() {
  const { isAuth } = useAuth();
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
              <OykAppSidebarNavItem icon={LayoutDashboard} text={t("Dashboard")} href="home" />
              <OykAppSidebarNavItem icon={Compass} text={t("Discover")} href="discover" />
              {isAuth && (<OykAppSidebarNavItem icon={ListTodo} text={t("Tasks")} href="tasks" />)}
            </ul>
          </nav>
        </section>
        <footer className="oyk-app-sidebar-footer">
          <nav className="oyk-app-sidebar-nav">
            <ul className="oyk-app-sidebar-nav-list">
              {isAuth && (<OykAppSidebarNavItem icon={Settings} text={t("Settings")} href="settings" />)}
              <OykAppSidebarNavItem icon={Blocks} text={t("Components")} href="dev-components" />
            </ul>
          </nav>
        </footer>
      </OykScrollbar>
    </aside>
  );
}
