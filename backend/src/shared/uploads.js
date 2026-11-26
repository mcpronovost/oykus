import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const UPLOADS_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads",
);

const WEBP_RIFF = Buffer.from("RIFF");
const WEBP_WEBP = Buffer.from("WEBP");
const MAX_WEBP_BYTES = 1_500_000;

export function decodeWebpBase64(data) {
  const raw = typeof data === "string" && data.includes(",")
    ? data.slice(data.indexOf(",") + 1)
    : data;

  let buffer;
  try {
    buffer = Buffer.from(raw, "base64");
  } catch {
    return { error: "Invalid base64 data" };
  }

  if (buffer.length === 0) {
    return { error: "Empty image data" };
  }

  if (buffer.length > MAX_WEBP_BYTES) {
    return { error: "Image is too large" };
  }

  if (
    buffer.length < 12
    || !buffer.subarray(0, 4).equals(WEBP_RIFF)
    || !buffer.subarray(8, 12).equals(WEBP_WEBP)
  ) {
    return { error: "Image must be a WebP file" };
  }

  return { buffer };
}

async function saveWebp(buffer, relativeDir) {
  const filename = `${randomUUID()}.webp`;
  const absoluteDir = path.join(UPLOADS_ROOT, relativeDir);
  await mkdir(absoluteDir, { recursive: true });
  await writeFile(path.join(absoluteDir, filename), buffer);
  return `/uploads/${relativeDir}/${filename}`;
}

export function saveSpaceCover(buffer) {
  return saveWebp(buffer, "spaces");
}

export function saveUserProfileImage(userId, buffer) {
  return saveWebp(buffer, `users/${userId}`);
}

export async function deleteUploadIfOwned(publicPath) {
  if (typeof publicPath !== "string" || !publicPath.startsWith("/uploads/")) {
    return;
  }

  const relative = publicPath.slice("/uploads/".length);
  if (!relative || relative.includes("..") || path.isAbsolute(relative)) {
    return;
  }

  const absolute = path.join(UPLOADS_ROOT, relative);
  if (!absolute.startsWith(UPLOADS_ROOT)) {
    return;
  }

  try {
    await unlink(absolute);
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }
}
