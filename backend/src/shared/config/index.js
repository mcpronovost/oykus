const isProd = process.env.NODE_ENV === "production";

export const config = {
  isProd,
  session: {
    cookieName: process.env.SESSION_COOKIE_NAME ?? "oykus_session",
    ttlMs: Number(process.env.SESSION_TTL_MS ?? 1000 * 60 * 60 * 24 * 14),
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
