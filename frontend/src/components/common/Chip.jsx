export default function OykChip({ children, color = "default", outline = false }) {
  return (
    <span
      className={`oyk-chip ${!color?.startsWith("#") ? `oyk-chip-${color}` : ""} ${outline ? "oyk-chip-outline" : ""}`}
      style={
        color?.startsWith("#")
          ? {
              backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
              borderColor: color,
            }
          : {}
      }
    >
      <span className="oyk-chip-content" style={color?.startsWith("#") ? { color: color } : {}}>
        {children}
      </span>
    </span>
  );
}