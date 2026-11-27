import { object, string } from "../../shared/validate.js";

export const setCurrentSpaceInput = object({
  spaceId: string({ required: true, min: 1, max: 36 }),
});

const profileImage = string({ required: false });

export const updateProfileImagesInput = object({
  avatar: profileImage,
  cover: profileImage,
});

const profileName = string({ min: 1, max: 100 });
const profileLanguage = string({ max: 2 });
const profileTimezone = string({ max: 100 });

function optionalProfileField(validate) {
  return (input) => input === undefined ? { value: undefined, errors: [] } : validate(input);
}

export const updateProfileInput = object({
  name: optionalProfileField(profileName),
  language: optionalProfileField((input) => {
    const result = profileLanguage(input);
    if (!result.errors.length && !["fr", "en"].includes(result.value)) {
      result.errors.push("Unsupported language");
    }
    return result;
  }),
  timezone: optionalProfileField((input) => {
    const result = profileTimezone(input);
    if (result.errors.length) return result;

    try {
      new Intl.DateTimeFormat("en", { timeZone: result.value });
      if (!/^[a-z]/i.test(result.value)) result.errors.push("Invalid timezone");
    } catch {
      result.errors.push("Invalid timezone");
    }
    return result;
  }),
  avatar: profileImage,
  cover: profileImage,
});
