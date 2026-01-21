export default function OykCard({
  children,
  nop = false,
  fh = false,
  alignTop = false,
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
        alignTop ? "oyk-card-aligntop" : "",
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
