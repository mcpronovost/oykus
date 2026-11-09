export const SPACE_OUTPUT_SELECT = {
  id: true,
  name: true,
  description: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
};

export function toSpaceOutput(space) {
  return {
    id: space.id,
    name: space.name,
    description: space.description,
    ownerId: space.ownerId,
    createdAt: space.createdAt,
    updatedAt: space.updatedAt,
  };
}
