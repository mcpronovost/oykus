import type { IconProps as TablerIconProps } from "@tabler/icons-react";

interface OykButtonProps {
  label?: string;
  icon?: React.ComponentType<TablerIconProps>;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const OykButton = ({ label, icon: Icon, disabled, onClick }: OykButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  return (
    <button className="oyk-button" disabled={disabled} onClick={handleClick}>
      <div className="oyk-button-bg" />
      <div className="oyk-button-content">
        {Icon && <Icon size={16} />}
        {label && <span className="oyk-button-content-label">{label}</span>}
      </div>
    </button>
  );
};