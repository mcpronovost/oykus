import { UnauthorizedError } from "../errors/index.js";
import { clearSessionCookie, getSessionToken, setSessionCookie } from "../auth/cookies.js";
import { authenticateSession } from "../auth/session.js";

export async function requireAuth(req, res, next) {
  try {
    const token = getSessionToken(req);
    const authentication = await authenticateSession(token);

    if (!authentication) {
      clearSessionCookie(res, req);
      throw new UnauthorizedError("Authentication required");
    }

    const { session, refreshed } = authentication;
    if (refreshed) {
      const maxAge = Math.max(0, session.expiresAt.getTime() - Date.now());
      setSessionCookie(res, token, req, maxAge);
    }

    req.session = session;
    req.userId = session.userId;
    next();
  } catch (error) {
    next(error);
  }
}
