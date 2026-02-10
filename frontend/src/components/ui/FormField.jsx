export default function OykFormField({
  ref,
  label,
  name,
  type = "text",
  options = [],
  optionLabel = "label",
  optionValue = "value",
  defaultValue,
  required = false,
  disabled = false,
  onChange,
  hasError,
  block = false,
  hideLabel = false,
  ...props
}) {
  return (
    <div className={`oyk-form-field ${block ? "oyk-form-field--block" : ""}`} {...props}>
      {!hideLabel ? (
        <label className="oyk-form-field-label" htmlFor={`field-${name}`}>
          {label}
          {required && <span className="oyk-form-field-required">*</span>}
        </label>
      ) : null}
      <div className="oyk-form-field-input">
        {type === "textarea" ? (
          <textarea
            ref={ref}
            id={`field-${name}`}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
            rows={6}
            required={required}
            className={`${hasError ? "oyk-error" : ""}`}
          />
        ) : type === "select" ? (
          <select
            ref={ref}
            id={`field-${name}`}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            className={`${hasError ? "oyk-error" : ""}`}
          >
            {options.map((option) => (
              <option key={option[optionValue]} value={option[optionValue]}>
                {option[optionLabel]}
              </option>
            ))}
          </select>
        ) : type === "radio" ? (
          <div className="oyk-form-field-input-radio">
            {options.map((option) => (
              <label key={option.value} className="oyk-form-field-input-radio-label">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  onChange={onChange}
                  required={required}
                  disabled={disabled}
                  checked={defaultValue === option.value}
                />
                <span className={`oyk-form-field-input-radio-label-btn ${disabled ? "oyk-disabled" : ""}`}>{option.label}</span>
              </label>
            ))}
          </div>
        ) : type === "color" ? (
          <div className="oyk-form-field-input-color">
            <input
              ref={ref}
              type="color"
              id={`field-${name}`}
              name={name}
              value={defaultValue}
              onChange={onChange}
              required={required}
              disabled={disabled}
              autoComplete="off"
              className={`${hasError ? "oyk-error" : ""}`}
            />
            <input
              ref={ref}
              type="text"
              id={`field-${name}-text`}
              name={name}
              value={defaultValue}
              onChange={onChange}
              required={required}
              disabled={disabled}
              autoComplete="off"
              className={`${hasError ? "oyk-error" : ""}`}
            />
          </div>
        ) : (
          <input
            ref={ref}
            type={type}
            id={`field-${name}`}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            autoComplete="off"
            className={`${hasError ? "oyk-error" : ""}`}
          />
        )}
        {hasError && <p className="oyk-form-field-error">{hasError}</p>}
      </div>
    </div>
  );
}
