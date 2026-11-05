import { UnauthorizedError } from "../errors/index.js";
import { clearSessionCookie, getSessionToken, setSessionCookie } from "../auth/cookies.js";
import { findValidSession, touchSession } from "../auth/session.js";

export async function requireAuth(req, res, next) {
  try {
    const token = getSessionToken(req);
    const session = await findValidSession(token);

    if (!session) {
      clearSessionCookie(res, req);
      throw new UnauthorizedError("Authentication required");
    }

    await touchSession(session.id);
    setSessionCookie(res, token, req);

    req.session = session;
    req.userId = session.userId;
    next();
  } catch (error) {
    next(error);
  }
}
