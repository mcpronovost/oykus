import type { SubmitEvent } from "react";
import { useEffect, useId, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconTrash } from "@tabler/icons-react";
import {
  ApiError,
  listEncyclopediaCategories,
  queryKeys,
  updateEncyclopediaEntry,
  type TypeEncyclopediaEntry,
} from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykButton, OykForm, OykModal } from "@/components/ui";
import OykEncyclopediaModalsDeleteEntry from "./EntryDelete";

interface OykEncyclopediaModalsEditEntryProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  entry: TypeEncyclopediaEntry | null;
  onUpdated?: (entry: TypeEncyclopediaEntry) => void;
  onDeleted?: () => void;
}

const INITIAL_FORM = {
  title: "",
  categoryId: "",
  summary: "",
};

export default function OykEncyclopediaModalsEditEntry({
  modalOpen,
  setModalOpen,
  entry,
  onUpdated,
  onDeleted,
}: OykEncyclopediaModalsEditEntryProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const formId = useId();
  const topicSlug = entry?.topic?.slug ?? null;
  const spaceId = entry?.spaceId ?? null;
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.encyclopedia.categories(topicSlug),
    queryFn: () => listEncyclopediaCategories(topicSlug!),
    enabled: Boolean(modalOpen && topicSlug),
  });

  useEffect(() => {
    if (!modalOpen || !entry) return;
    setForm({
      title: entry.title,
      categoryId: entry.categoryId ? String(entry.categoryId) : "",
      summary: entry.summary ?? "",
    });
    setError(null);
    setIsSubmitting(false);
  }, [modalOpen, entry]);

  const updateField = <K extends keyof typeof INITIAL_FORM>(
    key: K,
    value: (typeof INITIAL_FORM)[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setError(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setModalDeleteOpen(false);
      resetForm();
    }
  };

  const handleDeleted = () => {
    setModalDeleteOpen(false);
    setModalOpen(false);
    resetForm();
    onDeleted?.();
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!entry) {
      setError(t("Could not update the entry."));
      return;
    }

    const title = form.title.trim();
    if (!title) {
      setError(t("Title is required."));
      return;
    }

    let categoryId: number | null = null;
    if (form.categoryId) {
      const parsedCategoryId = Number(form.categoryId);
      if (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1) {
        setError(t("Select a valid category."));
        return;
      }
      const categoryExists = categories.some(
        (category) => category.id === parsedCategoryId,
      );
      if (!categoryExists) {
        setError(t("Select a valid category."));
        return;
      }
      categoryId = parsedCategoryId;
    }

    const summary = form.summary.trim();

    setIsSubmitting(true);
    try {
      const updatedEntry = await updateEncyclopediaEntry(entry.id, {
        title,
        categoryId,
        summary,
      });
      const invalidateTasks = [
        queryClient.invalidateQueries({
          queryKey: queryKeys.encyclopedia.recent(updatedEntry.spaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.encyclopedia.stats(updatedEntry.spaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.spaces.stats(updatedEntry.spaceId),
        }),
      ];
      if (topicSlug && spaceId) {
        invalidateTasks.push(
          queryClient.invalidateQueries({
            queryKey: queryKeys.encyclopedia.list(spaceId, topicSlug),
          }),
        );
      }
      await Promise.all(invalidateTasks);
      onUpdated?.(updatedEntry);
      handleOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.fields
          ? Object.values(err.fields)
              .flatMap((value) => (Array.isArray(value) ? value : []))
              .filter((value): value is string => typeof value === "string")
          : [];
        setError(
          fieldErrors[0] || err.message || t("Could not update the entry."),
        );
      } else {
        setError(t("Could not update the entry."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <OykEncyclopediaModalsDeleteEntry
        modalOpen={modalDeleteOpen}
        setModalOpen={setModalDeleteOpen}
        entry={entry}
        onDeleted={handleDeleted}
      />
      <OykModal
        open={modalOpen && !modalDeleteOpen}
        onOpenChange={handleOpenChange}
        title={t("encyclopedia.editEntry")}
        suptitle={`${t("Encyclopedia")}${topicSlug ? ` · ${t(`encyclopedia.topic.${topicSlug}`)}` : ""}`}
        content={
          <OykForm id={formId} loading={isSubmitting} onSubmit={handleSubmit}>
            <OykForm.Alert
              error={error ?? undefined}
              errorTitle={t("Could not update entry")}
            />
            <OykForm.Field
              name="title"
              label={t("Title")}
              placeholder={t("My entry title")}
              required
              value={form.title}
              onChange={(value) => updateField("title", value as string)}
            />
            <OykForm.Field
              type="select"
              name="category"
              label={t("Category")}
              placeholder={t("Select a category")}
              value={form.categoryId}
              options={categories.map((category) => ({
                value: String(category.id),
                label: t(`encyclopedia.category.${category.slug}`),
              }))}
              onChange={(value) => updateField("categoryId", value as string)}
            />
            <OykForm.Field
              type="textarea"
              name="summary"
              label={t("Summary")}
              placeholder={t("A short summary of this entry")}
              value={form.summary}
              onChange={(value) => updateField("summary", value as string)}
            />
          </OykForm>
        }
        prependActions={
          <OykButton
            start={IconTrash}
            color="danger"
            variant="ghost"
            disabled={isSubmitting}
            shrink
            onClick={() => setModalDeleteOpen(true)}
          />
        }
        actions={({ close }) => (
          <>
            <OykButton
              label={t("Cancel")}
              variant="ghost"
              disabled={isSubmitting}
              onClick={close}
            />
            <OykButton
              type="submit"
              form={formId}
              label={t("Save")}
              color="accent"
              disabled={isSubmitting}
            />
          </>
        )}
      />
    </>
  );
}
