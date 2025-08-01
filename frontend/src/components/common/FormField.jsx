export default function OykFormField({ label, name, type = "text", options = [], defaultValue, required = false, onChange, hasError, ...props }) {
  return (
    <div className="oyk-form-field" {...props}>
      <label className="oyk-form-field-label" htmlFor={`field-${name}`}>{label}{required && <span className="oyk-form-field-required">*</span>}</label>
      <div className="oyk-form-field-input">
        {type === "textarea" ? (
          <textarea
            id={`field-${name}`}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
            rows={6}
            required={required}
          />
        ) : type === "select" ? (
          <select
            id={`field-${name}`}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : type === "radio" ? (
          <div className="oyk-form-field-input-radio">
            {options.map((option) => (
              <label key={option.value} className="oyk-form-field-input-radio-label">
                <input type="radio" name={name} value={option.value} onChange={onChange} required={required} checked={defaultValue === option.value} />
                <span className="oyk-form-field-input-radio-label-btn">{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type={type}
            id={`field-${name}`}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
          />
        )}
      </div>
      {hasError && <p className="oyk-form-group-error">{hasError}</p>}
    </div>
  );
}
