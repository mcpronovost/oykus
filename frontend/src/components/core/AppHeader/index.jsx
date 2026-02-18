import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useWorld } from "@/services/world";

import OykAppHeaderMenu from "./Menu";
import OykAppHeaderLeveling from "./Leveling";
import OykAppHeaderNotifications from "./Notifications";
import OykAppHeaderAuth from "./Auth";
import OykAppHeaderUser from "./User";

export default function AppHeader() {
  const { isAuth } = useAuth();
  const { storeAppSidebarOpen, setStoreAppSidebarOpen } = useStore();
  const { currentUniverse } = useWorld();

  const handleToggleSidebar = () => {
    setStoreAppSidebarOpen(!storeAppSidebarOpen);
  };

  return (
    <header className="oyk-app-header">
      <section className="oyk-app-header-toggle">
        <button className="oyk-app-header-toggle-button" onClick={handleToggleSidebar}>
          {storeAppSidebarOpen ? <ArrowLeftFromLine size={18} /> : <ArrowRightFromLine size={18} />}
        </button>
      </section>
      {isAuth ? currentUniverse?.modules?.leveling?.active ? <OykAppHeaderLeveling /> : <div className="oyk-app-header-space"></div> : <OykAppHeaderMenu />}
      <OykAppHeaderNotifications />
      <section className="oyk-app-header-user">{isAuth ? <OykAppHeaderUser /> : <OykAppHeaderAuth />}</section>
    </header>
  );
}
