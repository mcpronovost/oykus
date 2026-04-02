import OykCard from "./Card";

export default function OykGrid({ full = false, children, className, ...props }) {
  return (
    <section className={`oyk-grid ${full ? "oyk-grid-full" : ""} ${className ? className : ""}`} {...props}>
      {children}
    </section>
  );
}

export function OykGridRow({ wrap, children, className, ...props }) {
  return (
    <div className={`oyk-grid-row ${wrap ? "oyk-grid-row-wrap" : ""} ${className ? className : ""}`} {...props}>
      {children}
    </div>
  );
}

export function OykGridCol({
  col = "100",
  xl = col,
  lg = xl,
  md = lg,
  sm = "100",
  order = 0,
  orderMd = 0,
  orderSm = 0,
  grow = true,
  children,
  className,
  ...props
}) {
  return (
    <div
      className={`oyk-grid-col oyk-col-${col} oyk-col-xl-${xl} oyk-col-lg-${lg} oyk-col-md-${md} oyk-col-sm-${sm} oyk-order-${order} oyk-order-md-${orderMd} oyk-order-sm-${orderSm} ${grow ? "oyk-grow" : ""} ${className ? className : ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function OykGridNav({ children, className, ...props }) {
  return (
    <aside className={`oyk-grid-row-nav ${className ? className : ""}`} {...props}>
      <OykCard nop>{children}</OykCard>
    </aside>
  );
}

export function OykGridMain({ children, className, ...props }) {
  return (
    <div className={`oyk-grid-row-main ${className ? className : ""}`} {...props}>
      {children}
    </div>
  );
}
