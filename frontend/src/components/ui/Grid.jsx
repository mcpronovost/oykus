import OykCard from "./Card";

export default function OykGrid({ children, className, ...props }) {
  return (
    <section className={`oyk-grid ${className ? className : ""}`} {...props}>
      {children}
    </section>
  );
}

export function OykGridRow({ children, className, ...props }) {
  return (
    <div className={`oyk-grid-row ${className ? className : ""}`} {...props}>
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
