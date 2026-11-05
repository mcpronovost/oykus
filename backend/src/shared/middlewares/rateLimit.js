import { TooManyRequestsError } from "../errors/index.js";

export function rateLimit({ windowMs, max, keyFn }) {
  const hits = new Map();

  function prune(now) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  }

  return (req, _res, next) => {
    const now = Date.now();
    prune(now);

    const key = keyFn(req);
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    current.count += 1;
    if (current.count > max) {
      next(new TooManyRequestsError("Too many attempts. Try again later."));
      return;
    }

    next();
  };
}
