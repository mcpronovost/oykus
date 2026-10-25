import type { IconProps as TablerIconProps } from "@tabler/icons-react";

interface OykButtonProps {
  icon?: React.ComponentType<TablerIconProps>;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

export const OykButton = ({ icon: Icon, disabled, onClick, children }: OykButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(event);
  };

  return (
    <button className="oyk-button" disabled={disabled} onClick={handleClick}>
      {Icon && <Icon size={16} />}
      {children && <span className="oyk-button-content">{children}</span>}
    </button>
  );
};