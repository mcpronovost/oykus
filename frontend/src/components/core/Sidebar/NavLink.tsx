import type { TablerIcon } from "@tabler/icons-react";
import { oykClass } from "@/utils";
import { useRouter } from "@/services/router";
import { OykLink,OykTooltip } from "@/components/ui";

interface OykCoreSidebarNavLinkProps {
  routeName?: string;
  label: string;
  icon: TablerIcon;
  size?: "sm" | "md" | "lg";
}

export default function OykCoreSidebarNavLink({ routeName, label, icon: NavLinkIcon, size = "md" }: OykCoreSidebarNavLinkProps) {
  const { route } = useRouter();

  return (
    <li className="oyk-core-sidebar-nav-list-item">
      <OykTooltip content={label}>
        <OykLink routeName={routeName} className={oykClass("oyk-core-sidebar-nav-link", routeName && route?.name === routeName && "oyk-active")}>
          <div className="oyk-core-sidebar-nav-link-content">
            <span className="oyk-core-sidebar-nav-link-icon">
              <NavLinkIcon size={size === "sm" ? 16 : size === "md" ? 24 : 32} stroke={1.5} />
            </span>
          </div>
        </OykLink>
      </OykTooltip>
    </li>
  );
}
