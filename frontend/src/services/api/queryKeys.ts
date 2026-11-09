export const queryKeys = {
  user: {
    all: ["user"] as const,
    me: ["user", "me"] as const,
  },
  spaces: {
    all: ["spaces"] as const,
    list: ["spaces", "list"] as const,
  },
} as const;
