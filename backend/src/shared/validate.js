export function string({ min, max, trim = true, required = true } = {}) {
  return (input) => {
    const errors = [];

    if (input === undefined || input === null) {
      if (required) errors.push("Required");
      return { value: input, errors };
    }

    if (typeof input !== "string") {
      errors.push("Must be a string");
      return { value: input, errors };
    }

    let value = trim ? input.trim() : input;

    if (required && value.length === 0) {
      errors.push("Required");
      return { value, errors };
    }

    if (min !== undefined && value.length < min) {
      errors.push(`Must be at least ${min} characters`);
    }

    if (max !== undefined && value.length > max) {
      errors.push(`Must be at most ${max} characters`);
    }

    return { value, errors };
  };
}

export function email(options = {}) {
  const base = string(options);
  return (input) => {
    const result = base(input);
    if (result.errors.length > 0 || !result.value) {
      return result;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.value)) {
      result.errors.push("Invalid email");
    }

    return result;
  };
}

export function number({ min, max, required = true, integer = false } = {}) {
  return (input) => {
    const errors = [];

    if (input === undefined || input === null || input === "") {
      if (required) errors.push("Required");
      return { value: input, errors };
    }

    const value = typeof input === "number" ? input : Number(input);
    if (!Number.isFinite(value)) {
      errors.push("Must be a number");
      return { value: input, errors };
    }

    if (integer && !Number.isInteger(value)) {
      errors.push("Must be an integer");
    }

    if (min !== undefined && value < min) {
      errors.push(`Must be at least ${min}`);
    }

    if (max !== undefined && value > max) {
      errors.push(`Must be at most ${max}`);
    }

    return { value, errors };
  };
}

export function object(shape) {
  return (input) => {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return { value: input, errors: { _form: ["Must be an object"] } };
    }

    const value = {};
    const errors = {};

    for (const [key, validator] of Object.entries(shape)) {
      const result = validator(input[key]);
      value[key] = result.value;

      if (Array.isArray(result.errors) && result.errors.length > 0) {
        errors[key] = result.errors;
      } else if (result.errors && typeof result.errors === "object") {
        errors[key] = result.errors;
      }
    }

    return {
      value,
      errors: Object.keys(errors).length > 0 ? errors : null,
    };
  };
}
