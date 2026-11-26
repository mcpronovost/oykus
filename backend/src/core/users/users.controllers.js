import { BadRequestError } from "../../shared/errors/index.js";
import { decodeWebpBase64 } from "../../shared/uploads.js";
import { setCurrentSpaceInput, updateProfileImagesInput } from "./users.inputs.js";
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

export async function updateProfileImages(req, res) {
  const input = parseBody(updateProfileImagesInput, req.body ?? {});
  const images = {};
  const errors = {};

  for (const [field, data] of Object.entries(input)) {
    if (data === undefined) continue;

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
  if (Object.keys(images).length === 0) {
    throw new BadRequestError("Validation failed", {
      _form: ["At least one image is required"],
    });
  }

  const user = await usersServices.updateProfileImages(req.userId, images);
  res.json({ data: user });
}

export async function setCurrentSpace(req, res) {
  const input = parseBody(setCurrentSpaceInput, req.body ?? {});
  const user = await usersServices.setCurrentSpace(req.userId, input);
  res.json({ data: user });
}
