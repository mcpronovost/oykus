export default function OykCard({
  children,
  nop = false,
  fh = false,
  fullCenter = false,
  alignTop = false,
  alignSpace = false,
  clickable = false,
  className = "",
  style,
  ...props
}) {
  return (
    <div
      className={[
        "oyk-card",
        nop ? "oyk-card-nop" : "",
        fh ? "oyk-card-fh" : "",
        fullCenter ? "oyk-card-fullcenter" : "",
        alignTop ? "oyk-card-aligntop" : "",
        alignSpace ? "oyk-card-alignspace" : "",
        clickable ? "oyk-card-clickable" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
