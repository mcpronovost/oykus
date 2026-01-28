const isSecureContext = typeof window !== "undefined" && window.location.protocol === "https:";

/**
 * Get a cookie value
 */
export const oykCookieGet = (name) => {
  const match = document.cookie.match(new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
};

/**
 * Set a secure cookie
 */
export const oykCookieSet = (
  name,
  value,
  {
    maxAge = 60 * 60 * 24 * 30, // 30 days
    path = "/",
    domain,
    sameSite = "Strict",
  } = {},
) => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookie += `; Max-Age=${maxAge}`;
  cookie += `; Path=${path}`;
  if (domain) cookie += `; Domain=${domain}`;

  // Security flags
  cookie += `; SameSite=${sameSite}`;
  if (isSecureContext) cookie += "; Secure";

  document.cookie = cookie;
};

/**
 * Delete cookie
 */
export const oykCookieDelete = (name, path = "/", domain) => {
  let cookie = `${encodeURIComponent(name)}=`;
  cookie += `; Max-Age=0`;
  cookie += `; Path=${path}`;
  if (domain) cookie += `; Domain=${domain}`;
  if (isSecureContext) cookie += "; Secure";
  cookie += "; SameSite=Strict";

  document.cookie = cookie;
};
