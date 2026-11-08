import type { ChangeEvent, HTMLAttributes, ReactNode, SubmitEvent } from "react";
import type { Icon } from "@tabler/icons-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  IconDirection,
  IconEye,
  IconEyeOff,
  IconSquareRounded,
  IconSquareRoundedCheck,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { getValidityMessage, oykClass } from "@/utils";
import OykAlert from "./Alert";
import OykScrollbar from "./Scrollbar";

const SELECT_MENU_MAX_HEIGHT = 240;
const SELECT_OPTION_HEIGHT = 34;
const SELECT_OPTION_GAP = 2;

function getSelectMenuHeight(optionCount: number) {
  const count = Math.max(optionCount, 1);
  const contentHeight = count * SELECT_OPTION_HEIGHT + (count - 1) * SELECT_OPTION_GAP;
  return Math.min(SELECT_MENU_MAX_HEIGHT, contentHeight);
}

interface OykFormFieldChecklistItem {
  label: string;
  test: (value: string) => boolean;
}

interface OykFormFieldOption {
  value: string;
  label: string;
}

interface OykFormProps extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  loading?: boolean;
  onSubmit?: (event: SubmitEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

interface OykFormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  type?: "text" | "email" | "password" | "checkbox" | "select" | "multiselect";
  name: string;
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  required?: boolean;
  helptext?: string;
  helplist?: OykFormFieldChecklistItem[];
  options?: OykFormFieldOption[];
  icon?: Icon;
  value?: string | boolean | string[];
  min?: number;
  max?: number;
  error?: string;
  onChange?: (value: string | boolean | string[]) => void;
  children?: ReactNode;
}

interface OykFormAlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "title"> {
  error?: string;
  errorTitle?: string;
  success?: string;
  successTitle?: string;
}

function getMultiselectValidityMessage(
  selectedCount: number,
  required: boolean,
  min?: number,
  max?: number,
) {
  const minimum = min ?? (required ? 1 : 0);
  if (selectedCount < minimum) {
    if (minimum === 1) return "This field is required";
    return `Select at least ${minimum} options`;
  }
  if (max !== undefined && selectedCount > max) {
    return `Select at most ${max} options`;
  }
  return undefined;
}

function getMultiselectVisibleCount(
  availableWidth: number,
  itemWidths: number[],
  moreWidthForCount: (hiddenCount: number) => number,
  moreGap: number,
) {
  if (itemWidths.length === 0 || availableWidth <= 0) return 0;

  const totalWidth = itemWidths.reduce((sum, width) => sum + width, 0);
  if (totalWidth <= availableWidth) return itemWidths.length;

  for (let visibleCount = itemWidths.length - 1; visibleCount >= 0; visibleCount -= 1) {
    const hiddenCount = itemWidths.length - visibleCount;
    const visibleWidth = itemWidths.slice(0, visibleCount).reduce((sum, width) => sum + width, 0);
    const moreWidth = moreWidthForCount(hiddenCount);
    const needed = visibleWidth + (visibleCount > 0 ? moreGap : 0) + moreWidth;
    if (needed <= availableWidth) return visibleCount;
  }

  return 0;
}

function OykFormField({
  type = "text",
  name,
  label,
  hideLabel = false,
  placeholder,
  required = false,
  helptext,
  helplist,
  options = [],
  icon: IconComponent,
  value = "",
  min,
  max,
  error,
  onChange,
  children,
  className,
  ...props
}: OykFormFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const multiValuesRef = useRef<HTMLSpanElement>(null);
  const multiMeasureRef = useRef<HTMLSpanElement>(null);
  const [nativeError, setNativeError] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [multiVisibleCount, setMultiVisibleCount] = useState(0);

  const isCheckbox = type === "checkbox";
  const isMultiSelect = type === "multiselect";
  const isSelect = type === "select" || isMultiSelect;
  const stringValue = typeof value === "string" ? value : "";
  const selectedValues = Array.isArray(value) ? value : [];
  const isChecked = Boolean(value);
  const errorMessage = error || nativeError;
  const fieldId = `field-${name}`;
  const listboxId = `listbox-${name}`;
  const hintId = `hint-${name}`;
  const describedBy = errorMessage ? undefined : helptext || helplist ? hintId : undefined;
  const selectedOption = options.find((option) => option.value === stringValue);
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));
  const hasSelectValue = isMultiSelect ? selectedOptions.length > 0 : Boolean(selectedOption);
  const isAtMax = max !== undefined && selectedValues.length >= max;
  const multiHiddenCount = Math.max(selectedOptions.length - multiVisibleCount, 0);
  const visibleMultiOptions = selectedOptions.slice(0, multiVisibleCount);
  const selectedOptionsKey = selectedOptions
    .map((option) => `${option.value}:${option.label}`)
    .join("|");

  useEffect(() => {
    if (!isMultiSelect || !nativeInputRef.current) return;
    const message =
      getMultiselectValidityMessage(selectedValues.length, required, min, max) || "";
    nativeInputRef.current.setCustomValidity(message);
  }, [isMultiSelect, selectedValues, required, min, max]);

  useLayoutEffect(() => {
    if (!isMultiSelect) return;

    const valuesEl = multiValuesRef.current;
    const measureEl = multiMeasureRef.current;
    if (!valuesEl || !measureEl) return;

    const updateVisibleCount = () => {
      const itemEls = Array.from(
        measureEl.querySelectorAll<HTMLElement>("[data-multiselect-measure-item]"),
      );
      const moreEls = Array.from(
        measureEl.querySelectorAll<HTMLElement>("[data-multiselect-measure-more]"),
      );
      const itemWidths = itemEls.map((item) => item.offsetWidth);
      const moreWidthByCount = new Map(
        moreEls.map((moreEl) => [Number(moreEl.dataset.hiddenCount), moreEl.offsetWidth]),
      );
      // `.oyk-form-field-select-value + .oyk-form-field-select-more` applies margin-left
      const moreGap = moreEls[0]
        ? Number.parseFloat(getComputedStyle(moreEls[0]).marginLeft) || 0
        : 0;

      setMultiVisibleCount(
        getMultiselectVisibleCount(
          valuesEl.clientWidth,
          itemWidths,
          (hiddenCount) => moreWidthByCount.get(hiddenCount) || moreWidthByCount.get(1) || 0,
          moreGap,
        ),
      );
    };

    updateVisibleCount();

    const resizeObserver = new ResizeObserver(updateVisibleCount);
    resizeObserver.observe(valuesEl);
    return () => resizeObserver.disconnect();
  }, [isMultiSelect, selectedOptionsKey]);

  useEffect(() => {
    if (!selectOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (fieldRef.current?.contains(event.target as Node)) return;
      setSelectOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectOpen]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = isCheckbox ? event.target.checked : event.target.value;
    onChange?.(nextValue);
    setNativeError(getValidityMessage(event.target.validity));
  };

  const handleSelect = (nextValue: string) => {
    onChange?.(nextValue);
    setSelectOpen(false);
    setNativeError(required && nextValue === "" ? "This field is required" : undefined);
  };

  const handleMultiSelect = (nextValue: string) => {
    const isSelected = selectedValues.includes(nextValue);
    if (!isSelected && isAtMax) return;

    const nextValues = isSelected
      ? selectedValues.filter((valueItem) => valueItem !== nextValue)
      : [...selectedValues, nextValue];

    onChange?.(nextValues);
    setNativeError(getMultiselectValidityMessage(nextValues.length, required, min, max));
  };

  const toggleSelect = () => {
    setSelectOpen((open) => !open);
  };

  return (
    <div ref={fieldRef} className={oykClass("oyk-form-field", className)} {...props}>
      {!hideLabel && label ? (
        <label className="oyk-form-field-label" htmlFor={fieldId}>
          {label}
          {required ? <span className="oyk-form-field-required">*</span> : null}
        </label>
      ) : null}
      <div
        className={oykClass(
          "oyk-form-field-input",
          isCheckbox && "oyk-unbox",
          isSelect && "oyk-select",
          selectOpen && "oyk-open",
          errorMessage && "oyk-invalid",
        )}
      >
        {IconComponent ? (
          <div className="oyk-form-field-input-prepend">
            <IconComponent size={19} />
          </div>
        ) : null}
        <div className="oyk-form-field-input-content">
          {isCheckbox ? (
            <div className="oyk-form-field-input-content-labeled">
              <input
                id={fieldId}
                name={name}
                type="checkbox"
                checked={isChecked}
                required={required}
                onChange={handleChange}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errorMessage) || undefined}
              />
              <label htmlFor={fieldId}>
                <span className="oyk-form-field-input-content-labeled-icon">
                  {isChecked ? (
                    <IconSquareRoundedCheck size={22} color="var(--oyk-c-accent)" />
                  ) : (
                    <IconSquareRounded size={22} />
                  )}
                </span>
                <div>{children}</div>
              </label>
            </div>
          ) : isSelect ? (
            <>
              <button
                type="button"
                id={fieldId}
                className="oyk-form-field-select-trigger"
                aria-haspopup="listbox"
                aria-expanded={selectOpen}
                aria-controls={listboxId}
                aria-describedby={describedBy}
                aria-invalid={Boolean(errorMessage) || undefined}
                aria-label={
                  isMultiSelect && hasSelectValue
                    ? selectedOptions.map((option) => option.label).join(", ")
                    : undefined
                }
                onClick={toggleSelect}
              >
                {isMultiSelect ? (
                  <>
                    <span
                      ref={multiValuesRef}
                      className={oykClass(
                        "oyk-form-field-select-values",
                        hasSelectValue ? "oyk-value" : "oyk-placeholder",
                      )}
                    >
                      {hasSelectValue ? (
                        <>
                          {visibleMultiOptions.map((option, index) => (
                            <span key={option.value} className="oyk-form-field-select-value">
                              {index > 0 ? `, ${option.label}` : option.label}
                            </span>
                          ))}
                          {multiHiddenCount > 0 ? (
                            <span className="oyk-form-field-select-more">+{multiHiddenCount}</span>
                          ) : null}
                        </>
                      ) : (
                        placeholder || ""
                      )}
                    </span>
                    <span
                      ref={multiMeasureRef}
                      className="oyk-form-field-select-measure"
                      aria-hidden
                    >
                      {selectedOptions.map((option, index) => (
                        <span
                          key={option.value}
                          data-multiselect-measure-item
                          className="oyk-form-field-select-value"
                        >
                          {index > 0 ? `, ${option.label}` : option.label}
                        </span>
                      ))}
                      {selectedOptions.map((_, index) => {
                        const hiddenCount = selectedOptions.length - index;
                        if (hiddenCount <= 0) return null;
                        return (
                          <span
                            key={`more-${hiddenCount}`}
                            data-multiselect-measure-more
                            data-hidden-count={hiddenCount}
                            className="oyk-form-field-select-more"
                          >
                            +{hiddenCount}
                          </span>
                        );
                      })}
                    </span>
                  </>
                ) : (
                  <span className={oykClass(!hasSelectValue ? "oyk-placeholder" : "oyk-value")}>
                    {hasSelectValue ? selectedOption?.label : placeholder || ""}
                  </span>
                )}
              </button>
              <input
                ref={nativeInputRef}
                className="oyk-form-field-select-native"
                name={name}
                value={isMultiSelect ? selectedValues.join(",") : stringValue}
                required={required || Boolean(min)}
                tabIndex={-1}
                readOnly
                aria-hidden
                onChange={() => {}}
                onInvalid={(event) => {
                  event.preventDefault();
                  if (isMultiSelect) {
                    setNativeError(
                      getMultiselectValidityMessage(selectedValues.length, required, min, max),
                    );
                    return;
                  }
                  setNativeError(getValidityMessage(event.currentTarget.validity));
                }}
              />
            </>
          ) : (
            <input
              id={fieldId}
              name={name}
              placeholder={placeholder}
              type={type === "password" && showPassword ? "text" : type}
              autoComplete="off"
              value={stringValue}
              required={required}
              onChange={handleChange}
              aria-describedby={describedBy}
              aria-invalid={Boolean(errorMessage) || undefined}
            />
          )}
        </div>
        {type === "password" ? (
          <button
            type="button"
            className="oyk-form-field-input-append oyk-clickable"
            onClick={() => setShowPassword((show) => !show)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <IconEye size={19} /> : <IconEyeOff size={19} />}
          </button>
        ) : null}
        {isSelect ? (
          <button
            type="button"
            className="oyk-form-field-input-append oyk-clickable"
            onClick={toggleSelect}
            aria-label={selectOpen ? "Close options" : "Open options"}
            tabIndex={-1}
          >
            <IconDirection size={19} />
          </button>
        ) : null}
        {isSelect && selectOpen ? (
          <div className="oyk-form-field-select oyk-card">
            <OykScrollbar height={getSelectMenuHeight(options.length)}>
              <ul
                id={listboxId}
                className="oyk-form-field-select-list"
                role="listbox"
                aria-labelledby={fieldId}
                aria-multiselectable={isMultiSelect || undefined}
              >
                {options.map((option) => {
                  const isSelected = isMultiSelect
                    ? selectedValues.includes(option.value)
                    : option.value === stringValue;
                  const isDisabled = isMultiSelect && !isSelected && isAtMax;
                  return (
                    <li key={option.value} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={isDisabled}
                        className={oykClass(
                          "oyk-form-field-select-option",
                          isSelected && "oyk-selected",
                          isDisabled && "oyk-disabled",
                        )}
                        onClick={() =>
                          isMultiSelect
                            ? handleMultiSelect(option.value)
                            : handleSelect(option.value)
                        }
                      >
                        <span>{option.label}</span>
                        {isSelected ? <IconCheck size={16} /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </OykScrollbar>
          </div>
        ) : null}
      </div>
      {errorMessage ? (
        <div className="oyk-form-field-error" role="alert">
          <p>{errorMessage}</p>
        </div>
      ) : stringValue && helplist ? (
        <ul className="oyk-form-field-helplist" id={hintId}>
          {helplist.map((rule) => {
            const isValid = rule.test(stringValue);
            return (
              <li key={rule.label} className={isValid ? "oyk-valid" : undefined}>
                {isValid ? <IconCheck size={14} /> : <IconX size={14} />}
                <span>{rule.label}</span>
              </li>
            );
          })}
        </ul>
      ) : helptext ? (
        <div className="oyk-form-field-helptext">
          <p id={hintId}>{helptext}</p>
        </div>
      ) : null}
    </div>
  );
}

function OykFormAlert({
  error,
  errorTitle,
  success,
  successTitle,
  ...props
}: OykFormAlertProps) {
  if (!error && !success) return null;

  return (
    <>
      {error ? (
        <OykAlert {...props} title={errorTitle} message={error} color="danger" variant="ghost" />
      ) : null}
      {success ? (
        <OykAlert {...props} title={successTitle} message={success} color="success" variant="ghost" />
      ) : null}
    </>
  );
}

function OykFormRoot({
  loading = false,
  onSubmit,
  children,
  className,
  ...props
}: OykFormProps) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    onSubmit?.(event);
  };

  return (
    <form
      className={oykClass("oyk-form", loading && "oyk-loading", className)}
      onSubmit={handleSubmit}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
    </form>
  );
}

const OykForm = Object.assign(OykFormRoot, {
  Field: OykFormField,
  Alert: OykFormAlert,
});

export default OykForm;
