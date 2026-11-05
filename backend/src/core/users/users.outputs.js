export const USER_OUTPUT_SELECT = {
  id: true,
  name: true,
  avatar: true,
  cover: true,
  createdAt: true,
  updatedAt: true,
};

export function toUserOutput(user) {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    cover: user.cover,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
