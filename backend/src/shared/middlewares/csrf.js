import { ForbiddenError } from "../errors/index.js";

function getRequestHost(req) {
  const forwarded = req.get("x-forwarded-host");
  if (forwarded) {
    return forwarded.split(",")[0].trim().toLowerCase();
  }
  return (req.get("host") ?? "").toLowerCase();
}

export function csrfOriginCheck(req, _res, next) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    next();
    return;
  }

  const origin = req.get("origin");
  if (!origin) {
    next(new ForbiddenError("Missing Origin header"));
    return;
  }

  let originHost;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    next(new ForbiddenError("Invalid Origin header"));
    return;
  }

  const requestHost = getRequestHost(req);
  if (!requestHost || originHost !== requestHost) {
    next(new ForbiddenError("Origin check failed"));
    return;
  }

  next();
}
