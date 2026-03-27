import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useWorld } from "@/services/world";

import { OykScrollbar } from "@/components/ui";

import OykCoreNavbarFooter from "./Footer";
import OykCoreNavbarUser from "./User";
import OykCoreNavbarMenuMain from "./MenuMain";
import OykCoreNavbarMenuUniverse from "./MenuUniverse";
import OykCoreNavbarMenuCharacter from "./MenuCharacter";

export default function AppNavbar({ isGameMode }) {
  const { isAuth } = useAuth();
  const { storeCoreNavbarOpen } = useStore();
  const { currentUniverse, currentCharacter } = useWorld();

  return (
    <aside className={`oyk-core-navbar ${storeCoreNavbarOpen && !isGameMode ? "open" : ""}`}>
      <OykScrollbar height="100%" className="oyk-core-navbar-scrollbar">
        <OykCoreNavbarUser isGameMode={isGameMode} />
        <section className="oyk-core-navbar-menu">
          <nav className="oyk-core-navbar-nav">
            <OykCoreNavbarMenuMain />
            {isAuth && currentUniverse && <OykCoreNavbarMenuUniverse />}
            {isAuth && currentUniverse && currentCharacter && <OykCoreNavbarMenuCharacter />}
          </nav>
        </section>
        <OykCoreNavbarFooter />
      </OykScrollbar>
    </aside>
  );
}
