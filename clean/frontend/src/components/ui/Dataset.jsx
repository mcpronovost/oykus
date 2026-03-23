export default function OykDataset({ children, small = false, ...props }) {
  return (
    <dl className={`oyk-dataset ${small ? "oyk-small" : ""}`} {...props}>
      {children}
    </dl>
  );
}

export function OykDatasetField({ term = "-", value = "-", preline = false }) {
  return (
    <>
      <dt className="oyk-dataset-term">{term}</dt>
      <dd className="oyk-dataset-value" style={{ whiteSpace: preline ? "pre-line" : "normal" }}>
        {value === null || value === "" ? "-" : value}
      </dd>
    </>
  );
}
