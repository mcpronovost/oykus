import type { TablerIcon } from "@tabler/icons-react";
import { oykClass } from "@/utils";
import { useRouter } from "@/services/router";
import { OykTooltip } from "@/components/ui";

interface OykCoreSidebarNavLinkProps {
  routeName: string;
  label: string;
  icon: TablerIcon;
}

export default function OykCoreSidebarNavLink({ routeName, label, icon: NavLinkIcon }: OykCoreSidebarNavLinkProps) {
  const { route, n } = useRouter();

  const handleClick = () => {
    n(routeName);
  };

  return (
    <li className="oyk-core-sidebar-nav-list-item">
      <OykTooltip content={label}>
        <div className={oykClass("oyk-core-sidebar-nav-link", route?.name === routeName && "oyk-active")} onClick={handleClick}>
          <div className="oyk-core-sidebar-nav-link-content">
            <span className="oyk-core-sidebar-nav-link-icon">
              <NavLinkIcon size={24} stroke={1.5} />
            </span>
          </div>
        </div>
      </OykTooltip>
    </li>
  );
}
