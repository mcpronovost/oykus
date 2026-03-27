import { BookOpen, Scale, Users } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import OykCoreNavbarNavItem from "./NavItem";

export default function CoreNavbarMenuUniverse() {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  return (
    <ul className="oyk-core-navbar-nav-list">
      {!currentUniverse.is_default && (
        <OykCoreNavbarNavItem
          icon={Scale}
          text={t("Rulebooks")}
          href="rulebooks"
          params={{ universeSlug: currentUniverse.slug }}
          disabled
        />
      )}
      {!currentUniverse.is_default && (
        <OykCoreNavbarNavItem
          icon={BookOpen}
          text={t("Context")}
          href="context"
          params={{ universeSlug: currentUniverse.slug }}
          disabled
        />
      )}
      <OykCoreNavbarNavItem
        icon={Users}
        text={t("Community")}
        href={currentUniverse.is_default ? "community" : "universe-community"}
        params={{ universeSlug: currentUniverse.slug }}
      />
    </ul>
  );
}
