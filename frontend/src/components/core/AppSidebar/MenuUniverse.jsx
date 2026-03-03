import { BookOpen, MessagesSquare, Users } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebarMenuUniverse() {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <ul className="oyk-app-sidebar-nav-list">
      <OykAppSidebarNavItem
        icon={BookOpen}
        text={t("Rulebooks")}
        href="rulebooks"
        params={{ universeSlug: currentUniverse.slug }}
      />
      {currentUniverse.modules?.forum?.active ? (
        <OykAppSidebarNavItem icon={MessagesSquare} text={t("Forum")} href="forum" />
      ) : null}
      <OykAppSidebarNavItem
        icon={Users}
        text={t("Community")}
        href={currentUniverse.is_default ? "community" : "universe-community"}
        params={{ universeSlug: currentUniverse.slug }}
      />
    </ul>
  );
}
