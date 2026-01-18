export default function ComponentApiTableItem({ name, description, type, defaultValue, enumValue }) {
  return (
    <tr className="oyk-components-api-table-item">
      <td>{name}</td>
      <td>
        {description}
        {enumValue && enumValue.length > 0 && (
          <div className="oyk-components-api-table-item-enum">
            {enumValue.map((value) => (
              <code className="small" key={value}>
                {value}
              </code>
            ))}
          </div>
        )}
      </td>
      <td>
        <code className="small">{type}</code>
      </td>
      <td>{defaultValue}</td>
    </tr>
  );
}