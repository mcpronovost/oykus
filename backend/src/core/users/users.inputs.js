import { object, string } from "../../shared/validate.js";

export const setCurrentSpaceInput = object({
  spaceId: string({ required: true, min: 1, max: 36 }),
});

const profileImage = string({ required: false });

export const updateProfileImagesInput = object({
  avatar: profileImage,
  cover: profileImage,
});
