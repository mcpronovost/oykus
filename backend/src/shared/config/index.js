const isProd = process.env.NODE_ENV === "production";
const sessionTtlMs = Number(process.env.SESSION_TTL_MS ?? 1000 * 60 * 60 * 24 * 14);

export const config = {
  isProd,
  session: {
    cookieName: process.env.SESSION_COOKIE_NAME ?? "oyk-session",
    ttlMs: sessionTtlMs,
    refreshIntervalMs: Math.min(10 * 60 * 1000, sessionTtlMs / 2),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  },
  rateLimit: {
    windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
    max: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 20),
  },
};
