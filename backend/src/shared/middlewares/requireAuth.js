import { UnauthorizedError } from "../errors/index.js";
import { clearSessionCookie, getSessionToken, setSessionCookie } from "../auth/cookies.js";
import { findValidSession, touchSession } from "../auth/session.js";

export async function requireAuth(req, res, next) {
  try {
    const token = getSessionToken(req);
    const session = await findValidSession(token);

    if (!session) {
      clearSessionCookie(res);
      throw new UnauthorizedError("Authentication required");
    }

    await touchSession(session.id);
    setSessionCookie(res, token);

    req.session = session;
    req.user = session.user;
    req.userId = session.user.id;
    next();
  } catch (error) {
    next(error);
  }
}
