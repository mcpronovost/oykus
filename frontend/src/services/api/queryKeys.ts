export const queryKeys = {
  user: {
    all: ["user"] as const,
    me: ["user", "me"] as const,
  },
  spaces: {
    all: ["spaces"] as const,
    list: ["spaces", "list"] as const,
    stats: (spaceId: string) => ["spaces", "stats", spaceId] as const,
  },
  notes: {
    all: ["notes"] as const,
    list: (spaceId: string) => ["notes", "list", spaceId] as const,
    categories: ["notes", "categories"] as const,
  },
  encyclopedia: {
    all: ["encyclopedia"] as const,
    list: (spaceId: string, topic: string) =>
      ["encyclopedia", "list", spaceId, topic] as const,
    categories: (topic: string) =>
      ["encyclopedia", "categories", topic] as const,
    topics: ["encyclopedia", "topics"] as const,
  },
} as const;
