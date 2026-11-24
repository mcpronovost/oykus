import { BadRequestError } from "./errors/index.js";
import { isUuid, number, object, string } from "./validate.js";

const pageLimit = number({ required: false, integer: true, min: 1, max: 50 });
function limitInput(input) {
  if (input !== undefined && (typeof input !== "string" || input.length === 0 || /\D/.test(input))) {
    return { errors: ["Must be an integer between 1 and 50"] };
  }
  return pageLimit(input);
}
const pageInput = object({
  limit: limitInput,
  cursor: string({ required: false, min: 1, max: 2048, trim: false }),
});
export function parseLimit(input, defaultLimit) {
  const { value, errors } = limitInput(input);
  if (errors.length) throw new BadRequestError("Validation failed", { limit: errors });
  return value ?? defaultLimit;
}

function readCursor(cursor, parseSortValue) {
  if (!/^[A-Za-z0-9_-]+$/.test(cursor)) return null;

  try {
    const bytes = Buffer.from(cursor, "base64url");
    if (bytes.toString("base64url") !== cursor) return null;

    const parts = JSON.parse(bytes.toString("utf8"));
    if (!Array.isArray(parts) || parts.length !== 2) return null;

    const [id, rawSortValue] = parts;
    if (!isUuid(id) || typeof rawSortValue !== "string") {
      return null;
    }

    const sortValue = parseSortValue(rawSortValue);
    return sortValue === null ? null : { id, sortValue };
  } catch {
    return null;
  }
}

export function parsePage(query, parseSortValue) {
  const { value, errors } = pageInput(query);
  if (errors) throw new BadRequestError("Validation failed", errors);

  const cursor = value.cursor === undefined ? null : readCursor(value.cursor, parseSortValue);
  if (value.cursor !== undefined && !cursor) {
    throw new BadRequestError("Validation failed", { cursor: ["Invalid cursor"] });
  }

  return { limit: value.limit ?? 25, cursor };
}

export function afterCursor(cursor, field, direction) {
  if (!cursor) return {};

  const comparison = direction === "asc" ? "gt" : "lt";
  return {
    OR: [
      { [field]: { [comparison]: cursor.sortValue } },
      { [field]: cursor.sortValue, id: { [comparison]: cursor.id } },
    ],
  };
}

export function toPage(rows, limit, field, toOutput) {
  const items = rows.slice(0, limit);
  const last = items.at(-1);
  return {
    items: items.map(toOutput),
    nextCursor: rows.length > limit
      ? Buffer.from(JSON.stringify([last.id, last[field]])).toString("base64url")
      : null,
  };
}
