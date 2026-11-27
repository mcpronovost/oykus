type TypeApiError = {
  code: string;
  message: string;
  fields?: Record<string, string[] | Record<string, unknown>>;
};

type TypeApiEnvelope<T> = {
  data?: T;
  error?: TypeApiError;
  ok?: boolean;
};

export class ApiError extends Error {
  code: string;
  fields?: TypeApiError["fields"];
  status: number;

  constructor(status: number, error: TypeApiError) {
    super(error.message);
    this.name = "ApiError";
    this.status = status;
    this.code = error.code;
    this.fields = error.fields;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as TypeApiEnvelope<T> | null;

  if (!response.ok) {
    throw new ApiError(response.status, payload?.error ?? {
      code: "request_failed",
      message: "The request failed.",
    });
  }

  if (payload && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export type TypePublicUser = {
  id: string;
  name: string;
  avatar: string | null;
  cover: string | null;
  language: string;
  timezone: string;
  currentSpace: TypeSpace | null;
  createdAt: string;
  updatedAt: string;
};

export type TypeProfileImages = Partial<Record<"avatar" | "cover", string>>;
export type TypeProfileDetails = Partial<Pick<TypePublicUser, "name" | "language" | "timezone">>;
export type TypeProfileUpdate = TypeProfileDetails & TypeProfileImages;

export type TypeSpace = {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type TypeCreateSpaceInput = {
  name: string;
  description?: string;
};

export type TypeUpdateSpaceInput = {
  name?: string;
  description?: string;
};

export type TypeSpaceStats = {
  notes: number;
  encyclopedia: Array<{
    slug: string;
    count: number;
  }>;
};

export type TypeSpaceLog = {
  id: string;
  action: string;
  details: { title?: string; topic?: string } | null;
  userName: string | null;
  createdAt: string;
};

export type TypeNoteCategory = {
  id: number;
  label: string;
};

type TypePage<T> = { items: T[]; nextCursor: string | null };

export type TypeNote = {
  id: string;
  content: string;
  categoryId: number | null;
  category: TypeNoteCategory | null;
  spaceId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TypeCreateNoteInput = {
  content: string;
  spaceId: string;
  categoryId?: number;
};

export type TypeEncyclopediaTopic = {
  id: number;
  slug: string;
  position: number;
  icon: string;
  color: string;
};

export type TypeEncyclopediaTopicStats = {
  slug: string;
  icon: string;
  color: string;
  count: number;
};

export type TypeEncyclopediaStats = {
  total: number;
  topics: TypeEncyclopediaTopicStats[];
};

export type TypeEncyclopediaCategory = {
  id: number;
  slug: string;
  topicId: number;
};

type TypeEncyclopediaCategoryCount = { categoryId: number | null; count: number };

export type TypeEncyclopediaEntry = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  spaceId: string;
  topicId: number;
  topic: TypeEncyclopediaTopic | null;
  categoryId: number | null;
  category: TypeEncyclopediaCategory | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TypeCreateEncyclopediaEntryInput = {
  title: string;
  spaceId: string;
  topic: string;
  categoryId?: number;
  summary?: string;
  slug?: string;
};

export type TypeUpdateEncyclopediaEntryInput = {
  title?: string;
  categoryId?: number | null;
  summary?: string;
  slug?: string;
};

async function getHealth(): Promise<void> {
  const response = await fetch("/api/v1/health", { credentials: "include" });
  if (!response.ok) {
    throw new Error("The health check failed.");
  }
}

async function login(username: string, password: string): Promise<TypePublicUser> {
  return request<TypePublicUser>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

async function logout(): Promise<void> {
  await request<void>("/api/v1/auth/logout", { method: "POST" });
}

async function getMe(): Promise<TypePublicUser> {
  return request<TypePublicUser>("/api/v1/users/me");
}

async function deleteAccount(confirmationName: string): Promise<void> {
  await request<void>("/api/v1/users/me", {
    method: "DELETE",
    body: JSON.stringify({ confirmationName }),
  });
}

async function updateProfile(input: TypeProfileUpdate): Promise<TypePublicUser> {
  return request<TypePublicUser>("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

async function updateProfileImages(input: TypeProfileImages): Promise<TypePublicUser> {
  return request<TypePublicUser>("/api/v1/users/me/images", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

async function listSpaces(): Promise<TypeSpace[]> {
  return request<TypeSpace[]>("/api/v1/spaces");
}

async function createSpace(input: TypeCreateSpaceInput): Promise<TypeSpace> {
  return request<TypeSpace>("/api/v1/spaces", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

async function updateSpace(
  spaceId: string,
  input: TypeUpdateSpaceInput,
): Promise<TypeSpace> {
  return request<TypeSpace>(`/api/v1/spaces/${encodeURIComponent(spaceId)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

async function setSpaceActive(
  spaceId: string,
  isActive: boolean,
): Promise<TypeSpace> {
  return request<TypeSpace>(
    `/api/v1/spaces/${encodeURIComponent(spaceId)}/active`,
    {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    },
  );
}

async function updateSpaceCover(
  spaceId: string,
  data: string,
): Promise<TypeSpace> {
  return request<TypeSpace>(
    `/api/v1/spaces/${encodeURIComponent(spaceId)}/cover`,
    {
      method: "PUT",
      body: JSON.stringify({ data }),
    },
  );
}

async function deleteSpace(spaceId: string): Promise<void> {
  await request<void>(`/api/v1/spaces/${spaceId}`, {
    method: "DELETE",
  });
}

async function getSpaceStats(spaceId: string): Promise<TypeSpaceStats> {
  return request<TypeSpaceStats>(`/api/v1/spaces/${spaceId}/stats`);
}

async function listSpaceLogs(spaceId: string, signal: AbortSignal): Promise<TypeSpaceLog[]> {
  return request<TypeSpaceLog[]>(`/api/v1/spaces/${encodeURIComponent(spaceId)}/logs`, { signal });
}

async function setCurrentSpace(spaceId: string): Promise<TypePublicUser> {
  return request<TypePublicUser>("/api/v1/users/me/current-space", {
    method: "PATCH",
    body: JSON.stringify({ spaceId }),
  });
}

async function listNotes(spaceId: string, cursor: string | null, signal: AbortSignal) {
  const query = cursor ? `?${new URLSearchParams({ cursor })}` : "";
  return request<TypePage<TypeNote>>(`/api/v1/spaces/${spaceId}/notes${query}`, { signal });
}

async function createNote(input: TypeCreateNoteInput): Promise<TypeNote> {
  return request<TypeNote>("/api/v1/notes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

async function deleteNote(noteId: string): Promise<void> {
  await request<void>(`/api/v1/notes/${noteId}`, {
    method: "DELETE",
  });
}

async function listNoteCategories(): Promise<TypeNoteCategory[]> {
  return request<TypeNoteCategory[]>("/api/v1/notes/categories");
}

async function listEncyclopediaTopics(): Promise<TypeEncyclopediaTopic[]> {
  return request<TypeEncyclopediaTopic[]>("/api/v1/encyclopedia/topics");
}

async function getEncyclopediaStats(
  spaceId: string,
): Promise<TypeEncyclopediaStats> {
  return request<TypeEncyclopediaStats>(
    `/api/v1/spaces/${spaceId}/encyclopedia/stats`,
  );
}

async function listEncyclopediaEntries(
  spaceId: string,
  topic: string,
  category: string | null | undefined,
  cursor: string | null,
  signal: AbortSignal,
) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (category === null) params.set("uncategorized", "true");
  else if (category !== undefined) params.set("category", category);
  const query = params.size ? `?${params}` : "";
  return request<TypePage<TypeEncyclopediaEntry>>(
    `/api/v1/spaces/${spaceId}/encyclopedia/${encodeURIComponent(topic)}${query}`,
    { signal },
  );
}

async function getEncyclopediaCategoryCounts(spaceId: string, topic: string) {
  return request<TypeEncyclopediaCategoryCount[]>(
    `/api/v1/spaces/${spaceId}/encyclopedia/${encodeURIComponent(topic)}/counts`,
  );
}

async function listRecentEncyclopediaEntries(
  spaceId: string,
): Promise<TypeEncyclopediaEntry[]> {
  return request<TypeEncyclopediaEntry[]>(
    `/api/v1/spaces/${spaceId}/encyclopedia/recent`,
  );
}

async function listEncyclopediaCategories(
  topic: string,
): Promise<TypeEncyclopediaCategory[]> {
  const params = new URLSearchParams({ topic });
  return request<TypeEncyclopediaCategory[]>(
    `/api/v1/encyclopedia/categories?${params.toString()}`,
  );
}

async function createEncyclopediaEntry(
  input: TypeCreateEncyclopediaEntryInput,
): Promise<TypeEncyclopediaEntry> {
  return request<TypeEncyclopediaEntry>("/api/v1/encyclopedia", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

async function updateEncyclopediaEntry(
  entryId: string,
  input: TypeUpdateEncyclopediaEntryInput,
): Promise<TypeEncyclopediaEntry> {
  return request<TypeEncyclopediaEntry>(
    `/api/v1/encyclopedia/${encodeURIComponent(entryId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

async function deleteEncyclopediaEntry(entryId: string): Promise<void> {
  await request<void>(
    `/api/v1/encyclopedia/${encodeURIComponent(entryId)}`,
    {
      method: "DELETE",
    },
  );
}

export { queryKeys } from "./queryKeys";
export {
  createEncyclopediaEntry,
  createNote,
  createSpace,
  deleteEncyclopediaEntry,
  deleteNote,
  deleteSpace,
  getEncyclopediaCategoryCounts,
  getEncyclopediaStats,
  getHealth,
  getMe,
  getSpaceStats,
  listEncyclopediaCategories,
  listEncyclopediaEntries,
  listEncyclopediaTopics,
  listRecentEncyclopediaEntries,
  listNoteCategories,
  listNotes,
  listSpaceLogs,
  listSpaces,
  login,
  logout,
  request,
  setCurrentSpace,
  setSpaceActive,
  updateEncyclopediaEntry,
  updateProfile,
  updateProfileImages,
  deleteAccount,
  updateSpace,
  updateSpaceCover,
};
