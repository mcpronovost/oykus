export default function OykForm({ children, onSubmit, isLoading, ...props }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit && !isLoading) {
      onSubmit(e);
    }
  };

  return (
    <form className="oyk-form" onSubmit={handleSubmit} disabled={isLoading} {...props}>
      {children}
    </form>
  );
}