import { Backpack, Flame } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykCoreNavbarNavItem from "./NavItem";

export default function CoreNavbarMenuCharacter() {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <ul className="oyk-core-navbar-nav-list">
      <OykCoreNavbarNavItem
        icon={Backpack}
        text={t("Inventory")}
        href="inventory"
      />
      <OykCoreNavbarNavItem
        icon={Flame}
        text={t("Capacities")}
        href="capacities"
      />
    </ul>
  );
}
