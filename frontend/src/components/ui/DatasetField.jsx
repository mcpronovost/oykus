export default function OykDatasetField({ term = "-", value = "-", preline = false}) {
  return (
    <>
      <dt className="oyk-dataset-term">
        {term}
      </dt>
      <dd className="oyk-dataset-value" style={{ whiteSpace: preline ? "pre-line" : "pre" }}>
        {value === null || value === "" ? "-" : value}
      </dd>
    </>
  );
}
