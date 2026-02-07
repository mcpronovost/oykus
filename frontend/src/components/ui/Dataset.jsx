export default function OykDataset({ children, ...props }) {
  return (
    <dl className="oyk-dataset" {...props}>
      {children}
    </dl>
  );
}
