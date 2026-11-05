import { config } from "../config/index.js";

export function parseCookies(header) {
  const cookies = {};
  if (!header) {
    return cookies;
  }

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (!key) {
      continue;
    }

    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
  }

  return cookies;
}

export function getSessionToken(req) {
  const cookies = parseCookies(req.get("cookie"));
  return cookies[config.session.cookieName] ?? null;
}

export function setSessionCookie(res, token) {
  const { cookieName, ttlMs, cookie } = config.session;
  res.cookie(cookieName, token, {
    ...cookie,
    maxAge: ttlMs,
  });
}

export function clearSessionCookie(res) {
  const { cookieName, cookie } = config.session;
  res.clearCookie(cookieName, {
    path: cookie.path,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
  });
}
