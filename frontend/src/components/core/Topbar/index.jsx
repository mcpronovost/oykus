import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useWorld } from "@/services/world";

import OykCoreTopbarBranding from "./Branding";
import OykCoreTopbarMenu from "./Menu";
// import OykCoreTopbarLeveling from "./Leveling";
import OykCoreTopbarNotifications from "./Notifications";
import OykCoreTopbarAuth from "./Auth";
import OykCoreTopbarUser from "./User";

export default function OykCoreTopbar({ isGameMode }) {
  const { isAuth } = useAuth();
  const { storeCoreNavbarOpen, setStoreCoreNavbarOpen, storeCoreGamebarOpen, setStoreCoreGamebarOpen } = useStore();
  const { currentUniverse } = useWorld();

  const handleToggleNavbar = () => {
    if (isGameMode) {
      setStoreCoreGamebarOpen(!storeCoreGamebarOpen);
    } else {
      setStoreCoreNavbarOpen(!storeCoreNavbarOpen);
    }
  };

  return (
    <header className="oyk-core-topbar">
      <OykCoreTopbarBranding isOpen={(isGameMode && storeCoreGamebarOpen) || (!isGameMode && storeCoreNavbarOpen)} />
      <section className="oyk-core-topbar-toggle">
        <button className="oyk-core-topbar-toggle-button" onClick={handleToggleNavbar}>
          {(isGameMode && storeCoreGamebarOpen) || (!isGameMode && storeCoreNavbarOpen) ? <ArrowLeftFromLine size={18} /> : <ArrowRightFromLine size={18} />}
        </button>
      </section>
      {!isAuth ||
      currentUniverse?.modules?.blog?.active ||
      currentUniverse?.modules?.planner?.active ||
      currentUniverse?.modules?.progress?.active ||
      currentUniverse?.modules?.collection?.active ? (
        <OykCoreTopbarMenu />
      ) : (
        <div className="oyk-core-topbar-space"></div>
      )}
      {/*isAuth && currentUniverse?.modules?.leveling?.active ? <OykCoreTopbarLeveling /> : <div className="oyk-core-topbar-space"></div>*/}
      <OykCoreTopbarNotifications />
      <section className="oyk-core-topbar-user">{isAuth ? <OykCoreTopbarUser /> : <OykCoreTopbarAuth />}</section>
    </header>
  );
}
