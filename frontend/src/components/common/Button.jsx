import { Loader } from "lucide-react";

import { useRouter } from "@/services/router";

export default function OykButton({
  children,
  routeName,
  params = {},
  action,
  icon: IconComponent,
  type = "button",
  disabled = false,
  isLoading = false,
  color = "default",
  plain = false,
  outline = false,
  block = false,
  className = "",
  style = {},
}) {
  const { n, lang } = useRouter();

  const handleClick = (e) => {
    if (type !== "submit") {
      e.preventDefault();
    }
    if (!disabled && routeName) {
      n(routeName, params, lang);
    } else if (!disabled && action) {
      action();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`oyk-button ${color ? `oyk-button-${color}` : ""} ${plain ? "oyk-button-plain" : ""} ${
        outline ? "oyk-button-outline" : ""
      } ${block ? "oyk-button-block" : ""} ${IconComponent && !children ? "oyk-button-icon" : ""} ${className}`}
      style={{
        ...style,
        ...(color?.startsWith("#") && {
          backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
          borderColor: color,
        }),
      }}
    >
      {isLoading && (
        <span className="oyk-button-loading">
          <Loader size={16} className="oyk-button-loading-icon" />
        </span>
      )}
      <span
        className={`oyk-button-content ${isLoading ? "oyk-button-content-loading" : ""}`}
        style={color?.startsWith("#") ? { color: color } : {}}
      >
        {IconComponent && <IconComponent size={16} />}
        {children && children}
      </span>
    </button>
  );
}