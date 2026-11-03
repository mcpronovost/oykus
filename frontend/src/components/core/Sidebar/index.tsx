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
import { OykSpacer, OykTooltip } from "@/components/ui";
import OykCoreSidebarNavLink from "./NavLink";

export default function OykCoreSidebar() {
  return (
    <div className="oyk-core-sidebar">
      <nav className="oyk-core-sidebar-nav">
        <ul className="oyk-core-sidebar-nav-list">
          <OykCoreSidebarNavLink routeName="dashboard" label="Dashboard" icon={IconLayoutGrid} />
          <OykCoreSidebarNavLink routeName="library" label="Library" icon={IconBooks} />
          <OykCoreSidebarNavLink routeName="notes" label="Notes" icon={IconNote} />
        </ul>
        <ul className="oyk-core-sidebar-nav-list">
          <OykCoreSidebarNavLink routeName="manuscript" label="Manuscript" icon={IconVocabulary} />
          <OykCoreSidebarNavLink routeName="forum" label="Forum" icon={IconMessages} />
          <OykCoreSidebarNavLink routeName="game" label="Game" icon={IconIcosahedron} />
        </ul>
        <OykSpacer />
        <ul className="oyk-core-sidebar-nav-list">
          <OykCoreSidebarNavLink routeName="settings" label="Settings" icon={IconSettings} />
        </ul>
      </nav>
    </div>
  );
}
