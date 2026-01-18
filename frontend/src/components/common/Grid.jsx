export default function OykGrid({ children, className, ...props }) {
  return (
    <section className={`oyk-grid ${className ? className : ""}`} {...props}>
      {children}
    </section>
  );
}