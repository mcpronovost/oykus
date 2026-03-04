import { BookOpen, MessagesSquare, Scale, Users } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykAppSidebarNavItem from "./NavItem";

export default function AppSidebarMenuUniverse() {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <ul className="oyk-app-sidebar-nav-list">
      <OykAppSidebarNavItem
        icon={Scale}
        text={t("Rulebooks")}
        href="rulebooks"
        params={{ universeSlug: currentUniverse.slug }}
      />
      <OykAppSidebarNavItem
        icon={BookOpen}
        text={t("Context")}
        href="context"
        params={{ universeSlug: currentUniverse.slug }}
      />
      <OykAppSidebarNavItem
        icon={Users}
        text={t("Community")}
        href={currentUniverse.is_default ? "community" : "universe-community"}
        params={{ universeSlug: currentUniverse.slug }}
      />
    </ul>
  );
}
