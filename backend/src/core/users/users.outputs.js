export const USER_OUTPUT_SELECT = {
  id: true,
  name: true,
  avatar: true,
  cover: true,
  language: true,
  timezone: true,
  currentSpace: {
    select: {
      id: true,
      name: true,
      description: true,
      cover: true,
      isActive: true,
      ownerId: true,
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
    language: user.language,
    timezone: user.timezone,
    currentSpace: user.currentSpace
      ? {
          id: user.currentSpace.id,
          name: user.currentSpace.name,
          description: user.currentSpace.description,
          cover: user.currentSpace.cover,
          isActive: user.currentSpace.isActive,
          ownerId: user.currentSpace.ownerId,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
