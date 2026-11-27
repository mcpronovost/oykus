import { clearSessionCookie } from "../../shared/auth/cookies.js";
import { BadRequestError } from "../../shared/errors/index.js";
import { decodeWebpBase64 } from "../../shared/uploads.js";
import { deleteAccountInput, setCurrentSpaceInput, updateProfileImagesInput, updateProfileInput } from "./users.inputs.js";
import * as usersServices from "./users.services.js";

function parseBody(schema, body) {
  const { value, errors } = schema(body);
  if (errors) {
    throw new BadRequestError("Validation failed", errors);
  }
  return value;
}

export async function me(req, res) {
  const user = await usersServices.getMe(req.userId);
  res.json({ data: user });
}

export async function deleteAccount(req, res) {
  const input = parseBody(deleteAccountInput, req.body ?? {});
  await usersServices.deleteAccount(req.userId, input);
  clearSessionCookie(res, req);
  res.status(204).send();
}

function decodeProfileImages(input) {
  const images = {};
  const errors = {};

  for (const [field, data] of Object.entries(input)) {
    if (data === undefined) continue;
    if (data === "") {
      images[field] = null;
      continue;
    }

    const decoded = decodeWebpBase64(data);
    if (decoded.error) {
      errors[field] = [decoded.error];
    } else {
      images[field] = decoded.buffer;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestError("Validation failed", errors);
  }
  return images;
}

export async function updateProfileImages(req, res) {
  const input = parseBody(updateProfileImagesInput, req.body ?? {});
  const images = decodeProfileImages(input);
  if (Object.keys(images).length === 0) {
    throw new BadRequestError("Validation failed", {
      _form: ["At least one image is required"],
    });
  }

  const user = await usersServices.updateProfile(req.userId, {}, images);
  res.json({ data: user });
}

export async function updateProfile(req, res) {
  const { avatar, cover, ...fields } = parseBody(updateProfileInput, req.body ?? {});
  const details = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
  const images = decodeProfileImages({ avatar, cover });
  if (Object.keys(details).length === 0 && Object.keys(images).length === 0) {
    throw new BadRequestError("Validation failed", {
      _form: ["At least one profile field is required"],
    });
  }

  const user = await usersServices.updateProfile(req.userId, details, images);
  res.json({ data: user });
}

export async function setCurrentSpace(req, res) {
  const input = parseBody(setCurrentSpaceInput, req.body ?? {});
  const user = await usersServices.setCurrentSpace(req.userId, input);
  res.json({ data: user });
}
