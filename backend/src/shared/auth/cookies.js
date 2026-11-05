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

function cookieOptions(req) {
  const { cookie } = config.session;
  return {
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    // Follow the request proto (trust proxy + X-Forwarded-Proto) so HTTP deploys work
    // and HTTPS automatically gets Secure.
    secure: Boolean(req.secure),
    path: cookie.path,
  };
}

export function setSessionCookie(res, token, req) {
  const { cookieName, ttlMs } = config.session;
  res.cookie(cookieName, token, {
    ...cookieOptions(req),
    maxAge: ttlMs,
  });
}

export function clearSessionCookie(res, req) {
  const { cookieName } = config.session;
  res.clearCookie(cookieName, cookieOptions(req));
}
