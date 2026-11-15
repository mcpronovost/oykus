import type { SubmitEvent } from "react";
import { useId, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ApiError,
  createEncyclopediaEntry,
  queryKeys,
  type TypeEncyclopediaCategory,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykButton, OykForm, OykModal } from "@/components/ui";

interface OykEncyclopediaModalsCreateEntryProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  topicSlug: string | null;
  categories: TypeEncyclopediaCategory[];
}

const INITIAL_FORM = {
  title: "",
  categoryId: "",
  summary: "",
};

export default function OykEncyclopediaModalsCreateEntry({
  modalOpen,
  setModalOpen,
  topicSlug,
  categories,
}: OykEncyclopediaModalsCreateEntryProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const formId = useId();
  const spaceId = user?.currentSpace?.id ?? null;
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!open) resetForm();
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!spaceId) {
      setError(t("Select a space before creating an entry."));
      return;
    }

    if (!topicSlug) {
      setError(t("Select a topic before creating an entry."));
      return;
    }

    const title = form.title.trim();
    if (!title) {
      setError(t("Title is required."));
      return;
    }

    let categoryId: number | undefined;
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
      await createEncyclopediaEntry({
        title,
        spaceId,
        topic: topicSlug,
        categoryId,
        summary: summary || undefined,
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.encyclopedia.list(spaceId, topicSlug),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.encyclopedia.recent(spaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.encyclopedia.stats(spaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.spaces.stats(spaceId),
        }),
      ]);
      handleOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.fields
          ? Object.values(err.fields)
              .flatMap((value) => (Array.isArray(value) ? value : []))
              .filter((value): value is string => typeof value === "string")
          : [];
        setError(
          fieldErrors[0] || err.message || t("Could not create the entry."),
        );
      } else {
        setError(t("Could not create the entry."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OykModal
      open={modalOpen}
      onOpenChange={handleOpenChange}
      title={t("encyclopedia.newEntry")}
      suptitle={`${t("Encyclopedia")} · ${t(`encyclopedia.topic.${topicSlug}`)}`}
      content={
        <OykForm id={formId} loading={isSubmitting} onSubmit={handleSubmit}>
          <OykForm.Alert
            error={error ?? undefined}
            errorTitle={t("Could not create entry")}
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
            label={t("Create")}
            color="accent"
            disabled={isSubmitting}
          />
        </>
      )}
    />
  );
}
