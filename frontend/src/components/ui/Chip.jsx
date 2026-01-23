export default function OykChip({ children, color = "default", outline = false, className = "", ...props }) {
  return (
    <span
      className={`oyk-chip ${!color?.startsWith("#") ? `oyk-chip-${color}` : ""} ${outline ? "oyk-chip-outline" : ""} ${className}`}
      style={
        color?.startsWith("#")
          ? {
              backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
              borderColor: color,
            }
          : {}
      }
      {...props}
    >
      <span className="oyk-chip-content" style={color?.startsWith("#") ? { color: color } : {}}>
        {children}
      </span>
    </span>
  );
}