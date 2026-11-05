import { BadRequestError } from "../../shared/errors/index.js";
import {
  clearSessionCookie,
  getSessionToken,
  setSessionCookie,
} from "../../shared/auth/cookies.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import * as authServices from "./auth.services.js";

function requestMeta(req) {
  return {
    userAgent: req.get("user-agent") ?? null,
    ip: req.ip ?? null,
  };
}

function parseBody(schema, body) {
  const { value, errors } = schema(body);
  if (errors) {
    throw new BadRequestError("Validation failed", errors);
  }
  return value;
}

export async function register(req, res) {
  const input = parseBody(registerSchema, req.body ?? {});
  const { token, user } = await authServices.register(input, requestMeta(req));
  setSessionCookie(res, token);
  res.status(201).json({ data: user });
}

export async function login(req, res) {
  const input = parseBody(loginSchema, req.body ?? {});
  const { token, user } = await authServices.login(input, requestMeta(req));
  setSessionCookie(res, token);
  res.json({ data: user });
}

export async function logout(req, res) {
  const token = getSessionToken(req);
  await authServices.logout(token);
  clearSessionCookie(res);
  res.status(204).send();
}

export async function logoutEverywhere(req, res) {
  await authServices.logoutEverywhere(req.userId);
  clearSessionCookie(res);
  res.status(204).send();
}
