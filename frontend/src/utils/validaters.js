export function getValidityMessage(validity) {
  if (!validity) return undefined;
  if (validity.valueMissing) return "This field is required";
  if (validity.typeMismatch) return "Invalid format";
  if (validity.tooShort) return "Too short";
  if (validity.tooLong) return "Too long";
  if (validity.patternMismatch) return "Invalid format";
  return undefined;
}
