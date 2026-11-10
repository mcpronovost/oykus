import type { SubmitEvent } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  OykAlert,
  OykButton,
  OykForm,
  OykGrid,
  OykHeading,
  OykModal,
  OykResult,
} from "@/components/ui";
import { OykMasonry } from "@/components/common";
import {
  ApiError,
  createNote,
  deleteNote,
  listNoteCategories,
  listNotes,
  queryKeys,
  type TypeNote,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { findOtherCategory, sortCategories } from "@/utils";

const INITIAL_FORM = {
  content: "",
  categoryId: "",
};

export default function OykNotes() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const spaceId = user?.currentSpaceId ?? user?.currentSpace?.id ?? null;

  const [formNote, setFormNote] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<TypeNote | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: notes = [],
    isPending: isNotesPending,
    isError: isNotesError,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: queryKeys.notes.list(spaceId ?? ""),
    queryFn: () => listNotes(spaceId!),
    enabled: Boolean(spaceId),
  });

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: queryKeys.notes.categories,
    queryFn: listNoteCategories,
  });

  const updateField = <K extends keyof typeof INITIAL_FORM>(
    key: K,
    value: (typeof INITIAL_FORM)[K],
  ) => {
    setFormNote((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!spaceId) {
      setError(t("Select a space before adding a note."));
      return;
    }

    const content = formNote.content.trim();
    if (!content) {
      setError(t("Note content is required."));
      return;
    }

    let categoryId: number;
    if (formNote.categoryId) {
      categoryId = Number(formNote.categoryId);
      if (!Number.isInteger(categoryId) || categoryId < 1) {
        setError(t("Select a valid category."));
        return;
      }
    } else {
      const otherCategory = findOtherCategory(categories);
      if (!otherCategory) {
        setError(t("Select a valid category."));
        return;
      }
      categoryId = otherCategory.id;
    }

    setIsSubmitting(true);
    try {
      await createNote({
        content,
        spaceId,
        categoryId,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.notes.list(spaceId),
      });
      setFormNote(INITIAL_FORM);
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.fields
          ? Object.values(err.fields)
              .flatMap((value) => (Array.isArray(value) ? value : []))
              .filter((value): value is string => typeof value === "string")
          : [];
        setError(fieldErrors[0] || err.message || t("Could not create the note."));
      } else {
        setError(t("Could not create the note."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open && isDeleting) return;
    if (!open) {
      setNoteToDelete(null);
      setDeleteError(null);
    }
  };

  const handleConfirmDelete = async (close: () => void) => {
    if (!noteToDelete || !spaceId) return;

    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteNote(noteToDelete.id);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.notes.list(spaceId),
      });
      setNoteToDelete(null);
      close();
    } catch (err) {
      if (err instanceof ApiError) {
        setDeleteError(err.message || t("Could not delete the note."));
      } else {
        setDeleteError(t("Could not delete the note."));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!spaceId) {
    return (
      <div className="oyk-page-notes">
        <OykGrid>
          <OykHeading title={t("Notes")} />
          <OykResult
            title={t("No space selected")}
            message={t("Choose a space to view and capture notes.")}
            variant="ghost"
          />
        </OykGrid>
      </div>
    );
  }

  const isPending = isNotesPending || isCategoriesPending;
  const isError = isNotesError || isCategoriesError;
  const sortedCategories = sortCategories(categories, (category) =>
    t(`note.category.${category.label}`),
  );

  return (
    <div className="oyk-page-notes">
      <OykGrid>
        <OykHeading title={t("Notes")} />
        <OykForm loading={isSubmitting} onSubmit={handleSubmit}>
          <OykForm.Alert
            error={error ?? undefined}
            errorTitle={t("Could not create note")}
          />
          <OykGrid.Row nop>
            <OykGrid.Col size={{ xs: 24, sm: 6, md: 4 }}>
              <OykForm.Field
                name="category"
                placeholder={t("Select category")}
                type="select"
                value={formNote.categoryId}
                onChange={(value) => updateField("categoryId", value as string)}
                options={sortedCategories.map((category) => ({
                  label: t(`note.category.${category.label}`),
                  value: String(category.id),
                }))}
              />
            </OykGrid.Col>
            <OykGrid.Col size={{ xs: 24, sm: 12, md: 16 }}>
              <OykForm.Field
                name="content"
                placeholder={t(
                  "Capture an idea, a quote, a question, or a thought...",
                )}
                value={formNote.content}
                onChange={(value) => updateField("content", value as string)}
                required
              />
            </OykGrid.Col>
            <OykGrid.Col size={{ xs: 24, sm: 6, md: 4 }}>
              <OykButton
                type="submit"
                label={t("Add Note")}
                color="accent"
                grow
                disabled={isSubmitting}
              />
            </OykGrid.Col>
          </OykGrid.Row>
        </OykForm>

        {isPending ? (
          <OykResult
            title={t("Loading notes")}
            message={t("Fetching notes for this space...")}
            variant="ghost"
          />
        ) : isError ? (
          <OykResult
            title={t("Could not load notes")}
            message={t("Something went wrong while fetching notes.")}
            color="danger"
            variant="ghost"
          >
            <OykButton
              label={t("Try again")}
              color="accent"
              onClick={() => {
                void refetchNotes();
                void refetchCategories();
              }}
            />
          </OykResult>
        ) : notes.length === 0 ? (
          <OykResult
            title={t("No notes yet")}
            message={t("Capture your first idea above.")}
            variant="ghost"
          />
        ) : (
          <OykMasonry notes={notes} onDeleteNote={setNoteToDelete} />
        )}
      </OykGrid>

      <OykModal
        open={Boolean(noteToDelete)}
        onOpenChange={handleDeleteOpenChange}
        title={t("Delete note")}
        size="sm"
        closable={!isDeleting}
        closeOnBackdrop={!isDeleting}
        content={({ close }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <p>
              {t("Are you sure you want to delete this note?")}
            </p>
            <OykAlert title={t("This action is irreversible.")} color="warning" variant="ghost" />
            {deleteError ? (
              <OykAlert title={deleteError} color="danger" variant="ghost" />
            ) : null}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <OykButton
                label={t("Cancel")}
                variant="ghost"
                disabled={isDeleting}
                onClick={close}
              />
              <OykButton
                label={t("Delete")}
                color="danger"
                disabled={isDeleting}
                onClick={() => {
                  void handleConfirmDelete(close);
                }}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
