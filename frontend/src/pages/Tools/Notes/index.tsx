import type { SubmitEvent } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconNoteOff } from "@tabler/icons-react";
import {
  OykButton,
  OykForm,
  OykGrid,
  OykHeading,
  OykResult,
} from "@/components/ui";
import { OykMasonry } from "@/components/common";
import {
  ApiError,
  createNote,
  listNoteCategories,
  listNotes,
  queryKeys,
  type TypeNote,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { findOtherCategory, sortCategories } from "@/utils";
import OykNotesModalsNoteDelete from "./modals/NoteDelete";

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
        setError(
          fieldErrors[0] || err.message || t("Could not create the note."),
        );
      } else {
        setError(t("Could not create the note."));
      }
    } finally {
      setIsSubmitting(false);
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
      <OykNotesModalsNoteDelete
        note={noteToDelete}
        setNote={setNoteToDelete}
        spaceId={spaceId}
      />
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
          <OykGrid.Row>
            <OykGrid.Col>
              <OykResult
                title={t("Loading notes")}
                message={t("Fetching notes for this space...")}
                variant="ghost"
              />
            </OykGrid.Col>
          </OykGrid.Row>
        ) : isError ? (
          <OykGrid.Row>
            <OykGrid.Col>
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
            </OykGrid.Col>
          </OykGrid.Row>
        ) : notes.length === 0 ? (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykResult
                title={t("No notes yet")}
                message={t("Capture your first idea above.")}
                variant="ghost"
                icon={IconNoteOff}
              />
            </OykGrid.Col>
          </OykGrid.Row>
        ) : (
          <OykMasonry notes={notes} onDeleteNote={setNoteToDelete} />
        )}
      </OykGrid>
    </div>
  );
}
