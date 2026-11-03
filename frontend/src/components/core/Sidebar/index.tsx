import {
  IconLayoutGrid,
  IconBooks,
  IconNote,
  IconPencil,
  IconVocabulary,
  IconMessages,
  IconIcosahedron,
  IconSettings,
} from "@tabler/icons-react";
import { oykClass } from "@/utils";
import { useTranslation } from "@/services/translation";
import { OykSpacer, OykTooltip } from "@/components/ui";
import OykCoreSidebarNavLink from "./NavLink";

export default function OykCoreSidebar() {
  const { t } = useTranslation();

  return (
    <div className="oyk-core-sidebar">
      <nav className="oyk-core-sidebar-nav">
        <ul className="oyk-core-sidebar-nav-list" aria-label={t("Tools")}>
          <OykCoreSidebarNavLink routeName="dashboard" label={t("Dashboard")} icon={IconLayoutGrid} />
          <OykCoreSidebarNavLink routeName="library" label={t("Library")} icon={IconBooks} />
          <OykCoreSidebarNavLink routeName="notes" label={t("Notes")} icon={IconNote} />
        </ul>
        <ul className="oyk-core-sidebar-nav-list" aria-label={t("Plugins")}>
          <OykCoreSidebarNavLink routeName="manuscript" label={t("Manuscript")} icon={IconVocabulary} />
          <OykCoreSidebarNavLink routeName="forum" label={t("Forum")} icon={IconMessages} />
          <OykCoreSidebarNavLink routeName="game" label={t("Game")} icon={IconIcosahedron} />
        </ul>
        <OykSpacer />
        <ul className="oyk-core-sidebar-nav-list" aria-label={t("Preferences")}>
          <OykCoreSidebarNavLink routeName="settings" label={t("Settings")} icon={IconSettings} />
        </ul>
      </nav>
    </div>
  );
}
