import { Backpack, Flame, Handshake, SquareUserRound, Wallet } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykScrollbar } from "@/components/ui";

import OykCoreGamebarCharacter from "./Character";
import OykCoreNavbarNavItem from "./NavItem";

export default function OykCoreGamebar() {
  const { isAuth } = useAuth();
  const { storeCoreGamebarOpen } = useStore();
  const { t } = useTranslation();
  const { currentUniverse, currentCharacter } = useWorld();

  return (
    <aside className={`oyk-core-gamebar ${storeCoreGamebarOpen ? "open" : ""}`}>
      <OykScrollbar height="100%" className="oyk-core-gamebar-scrollbar">
        {currentCharacter ? (
          <>
            <OykCoreGamebarCharacter />
            <section className="oyk-core-navbar-menu">
              <nav className="oyk-core-navbar-nav">
                <ul className="oyk-core-navbar-nav-list">
                  {currentCharacter && (
                    <OykCoreNavbarNavItem
                      icon={SquareUserRound}
                      text={t("Profile")}
                      href="universe-community-profile"
                      params={{ universeSlug: currentUniverse.slug, characterSlug: currentCharacter.slug }}
                      unactivable
                    />
                  )}
                  <OykCoreNavbarNavItem icon={Backpack} text={t("Inventory")} href="inventory" />
                  <OykCoreNavbarNavItem icon={Flame} text={t("Capacities")} href="capacities" />
                </ul>
                <ul className="oyk-core-navbar-nav-list">
                  <OykCoreNavbarNavItem
                    icon={Wallet}
                    text={t("Vos actifs")}
                    href="universe-game-economy-assets"
                    params={{ universeSlug: currentUniverse.slug, characterSlug: currentCharacter.slug }}
                  />
                  <OykCoreNavbarNavItem
                    icon={Handshake}
                    text={t("Vos passifs")}
                    href="universe-game-economy-liabilities"
                    params={{ universeSlug: currentUniverse.slug, characterSlug: currentCharacter.slug }}
                  />
                </ul>
              </nav>
            </section>
          </>
        ) : null}
      </OykScrollbar>
    </aside>
  );
}
