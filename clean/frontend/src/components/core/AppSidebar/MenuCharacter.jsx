import { Backpack, Flame } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebarMenuCharacter() {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <ul className="oyk-app-sidebar-nav-list">
      <OykAppSidebarNavItem
        icon={Backpack}
        text={t("Inventory")}
        href="inventory"
      />
      <OykAppSidebarNavItem
        icon={Flame}
        text={t("Capacities")}
        href="capacities"
      />
    </ul>
  );
}
