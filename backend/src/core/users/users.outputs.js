export const USER_OUTPUT_SELECT = {
  id: true,
  name: true,
  avatar: true,
  cover: true,
  currentSpace: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

export function toUserOutput(user) {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    cover: user.cover,
    currentSpace: user.currentSpace
      ? {
          id: user.currentSpace.id,
          name: user.currentSpace.name,
          description: user.currentSpace.description,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
