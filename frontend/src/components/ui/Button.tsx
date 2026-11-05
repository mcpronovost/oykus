import type { IconProps as TablerIconProps } from "@tabler/icons-react";
import { useRouter } from "@/services/router";

interface OykButtonProps {
  label?: string;
  icon?: React.ComponentType<TablerIconProps>;
  iconSize?: number;
  disabled?: boolean;
  routeName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function OykButton({ label, icon: Icon, iconSize = 16, disabled, routeName, onClick }: OykButtonProps) {
  const { route, n } = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (routeName) {
      n(routeName);
      return;
    }
    onClick?.(event);
  };

  return (
    <button className="oyk-button" disabled={disabled} onClick={handleClick}>
      <div className="oyk-button-bg" />
      <div className="oyk-button-content">
        {Icon && <Icon size={iconSize} />}
        {label && <span className="oyk-button-content-label">{label}</span>}
      </div>
    </button>
  );
}
