import * as usersServices from "./users.services.js";

export async function me(req, res) {
  const user = await usersServices.getMe(req.userId);
  res.json({ data: user });
}
