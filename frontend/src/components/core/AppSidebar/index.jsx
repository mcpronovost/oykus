import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useWorld } from "@/services/world";

import { OykScrollbar } from "@/components/ui";

import OykAppSidebarHeader from "./Header";
import OykAppSidebarFooter from "./Footer";
import OykAppSidebarUser from "./User";
import OykAppSidebarMenuMain from "./MenuMain";
import OykAppSidebarMenuUniverse from "./MenuUniverse";

export default function AppSidebar() {
  const { isAuth } = useAuth();
  const { storeAppSidebarOpen } = useStore();
  const { currentUniverse } = useWorld();

  return (
    <aside className={`oyk-app-sidebar ${storeAppSidebarOpen ? "open" : ""}`}>
      <OykAppSidebarHeader />
      <OykScrollbar height="100%" className="oyk-app-sidebar-scrollbar">
        <OykAppSidebarUser />
        <section className="oyk-app-sidebar-menu">
          <nav className="oyk-app-sidebar-nav">
            <OykAppSidebarMenuMain />
            {isAuth && currentUniverse && <OykAppSidebarMenuUniverse />}
          </nav>
        </section>
        <OykAppSidebarFooter />
      </OykScrollbar>
    </aside>
  );
}
