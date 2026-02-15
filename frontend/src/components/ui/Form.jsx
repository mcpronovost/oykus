export default function OykForm({ children, ref, onSubmit, isLoading, ...props }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit && !isLoading) {
      onSubmit(e);
    }
  };

  return (
    <form ref={ref} className="oyk-form" onSubmit={handleSubmit} disabled={isLoading} {...props}>
      {children}
    </form>
  );
}