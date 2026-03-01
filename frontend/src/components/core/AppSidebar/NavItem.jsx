import { useMemo } from "react";

import { useRouter } from "@/services/router";
import { OykChip, OykLink } from "@/components/ui";

export default function NavItem({
  icon: IconComponent,
  text,
  href,
  params,
  prefix = href,
  sideIcon: SideIconComponent,
  sideIconColor = "currentColor",
  sideChip,
  sideChipColor = "default",
  disabled = false,
}) {
  const { route } = useRouter();

  const isActive = useMemo(() => {
    if (["community"].includes(prefix)) {
      return route?.name === prefix;
    }
    return route?.name.startsWith(prefix);
  }, [route]);

  if (sideIconColor !== "currentColor") {
    sideIconColor = `var(--oyk-c-${sideIconColor})`;
  }

  return (
    <li className={`oyk-app-sidebar-nav-item ${isActive ? "oyk-active" : ""}`}>
      <OykLink
        routeName={href}
        params={params}
        className={`oyk-app-sidebar-nav-item-link ${disabled ? "disabled" : ""}`}
        disabled={disabled || isActive}
      >
        <span className="oyk-app-sidebar-nav-item-link-icon">
          <IconComponent size={18} />
        </span>
        <span className="oyk-app-sidebar-nav-item-link-text">{text}</span>
        {SideIconComponent && (
          <span className="oyk-app-sidebar-nav-item-link-side-icon">
            <SideIconComponent size={16} color={sideIconColor} />
          </span>
        )}
        {sideChip && (
          <span className="oyk-app-sidebar-nav-item-link-side-chip">
            <OykChip color={sideChipColor}>{sideChip}</OykChip>
          </span>
        )}
      </OykLink>
    </li>
  );
}