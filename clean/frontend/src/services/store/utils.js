export const storeGet = (key) => {
  const encodedAppStore = localStorage.getItem(`oyk-${key}`);
  return encodedAppStore ? JSON.parse(encodedAppStore) : null;
};

export const storeSet = (key, value) => {
  if (value !== undefined && value !== null) {
    localStorage.setItem(`oyk-${key}`, JSON.stringify(value));
  } else {
    storeRemove(key);
  }
};

export const storeRemove = (key) => {
  localStorage.removeItem(`oyk-${key}`);
};

export const storeClear = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("oyk-")) {
        localStorage.removeItem(key);
    }
  });
};

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
