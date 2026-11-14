export const ENCYCLOPEDIA_TOPIC_OUTPUT_SELECT = {
  id: true,
  slug: true,
};

export const ENCYCLOPEDIA_CATEGORY_OUTPUT_SELECT = {
  id: true,
  slug: true,
  topicId: true,
};

export const ENCYCLOPEDIA_ENTRY_SECTION_OUTPUT_SELECT = {
  id: true,
  title: true,
  content: true,
  position: true,
  createdAt: true,
  updatedAt: true,
};

export const ENCYCLOPEDIA_ENTRY_OUTPUT_SELECT = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  spaceId: true,
  topicId: true,
  categoryId: true,
  createdById: true,
  updatedById: true,
  createdAt: true,
  updatedAt: true,
  topic: {
    select: ENCYCLOPEDIA_TOPIC_OUTPUT_SELECT,
  },
  category: {
    select: ENCYCLOPEDIA_CATEGORY_OUTPUT_SELECT,
  },
};

export const ENCYCLOPEDIA_ENTRY_DETAIL_OUTPUT_SELECT = {
  ...ENCYCLOPEDIA_ENTRY_OUTPUT_SELECT,
  sections: {
    select: ENCYCLOPEDIA_ENTRY_SECTION_OUTPUT_SELECT,
    orderBy: { position: "asc" },
  },
};

export function toEncyclopediaTopicOutput(topic) {
  return {
    id: topic.id,
    slug: topic.slug,
  };
}

export function toEncyclopediaCategoryOutput(category) {
  return {
    id: category.id,
    slug: category.slug,
    topicId: category.topicId,
  };
}

export function toEncyclopediaEntrySectionOutput(section) {
  return {
    id: section.id,
    title: section.title,
    content: section.content,
    position: section.position,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
}

export function toEncyclopediaEntryOutput(entry) {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    summary: entry.summary ?? null,
    spaceId: entry.spaceId,
    topicId: entry.topicId,
    topic: entry.topic ? toEncyclopediaTopicOutput(entry.topic) : null,
    categoryId: entry.categoryId,
    category: entry.category ? toEncyclopediaCategoryOutput(entry.category) : null,
    createdById: entry.createdById ?? null,
    updatedById: entry.updatedById ?? null,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    ...(Array.isArray(entry.sections)
      ? { sections: entry.sections.map(toEncyclopediaEntrySectionOutput) }
      : {}),
  };
}
