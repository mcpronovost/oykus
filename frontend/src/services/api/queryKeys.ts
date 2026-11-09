export const queryKeys = {
  user: {
    all: ["user"] as const,
    me: ["user", "me"] as const,
  },
  spaces: {
    all: ["spaces"] as const,
    list: ["spaces", "list"] as const,
  },
  notes: {
    all: ["notes"] as const,
    list: (spaceId: string) => ["notes", "list", spaceId] as const,
    categories: ["notes", "categories"] as const,
  },
} as const;
