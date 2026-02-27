import OykCard from "./Card";

export default function OykGrid({ children, className, ...props }) {
  return (
    <section className={`oyk-grid ${className ? className : ""}`} {...props}>
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

export function OykGridCol({ col = "100", md = "100", sm = "100", grow = true, children, className, ...props }) {
  return (
    <div className={`oyk-grid-col oyk-col-${col} oyk-col-md-${md} oyk-col-sm-${sm} ${grow ? "oyk-grow" : ""} ${className ? className : ""}`} {...props}>
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
    <aside className={`oyk-grid-row-main ${className ? className : ""}`} {...props}>
      {children}
    </aside>
  );
}
