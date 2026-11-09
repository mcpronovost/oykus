import type { SubmitEvent } from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OykButton, OykForm, OykModal } from "@/components/ui";
import { ApiError, createSpace, queryKeys } from "@/services/api";
import { useAuth } from "@/services/auth";

const INITIAL_FORM = {
  name: "",
  description: "",
};

export default function OykDashboardModalsSpaceCreate({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}) {
  const { refresh } = useAuth();
  const queryClient = useQueryClient();
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

    const name = form.name.trim();
    if (!name) {
      setError("Name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSpace({
        name,
        description: form.description.trim() || undefined,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.spaces.list }),
        refresh(),
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
          fieldErrors[0] || err.message || "Could not create the space.",
        );
      } else {
        setError("Could not create the space.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OykModal
      open={modalOpen}
      onOpenChange={handleOpenChange}
      title="New Space"
      content={({ close }) => (
        <OykForm loading={isSubmitting} onSubmit={handleSubmit}>
          <OykForm.Alert
            error={error ?? undefined}
            errorTitle="Could not create space"
          />
          <OykForm.Field
            name="name"
            label="Name"
            placeholder="My world"
            required
            value={form.name}
            onChange={(value) => updateField("name", value as string)}
          />
          <OykForm.Field
            name="description"
            label="Description"
            placeholder="A short overview of this space"
            value={form.description}
            onChange={(value) => updateField("description", value as string)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <OykButton
              label="Cancel"
              variant="ghost"
              disabled={isSubmitting}
              onClick={close}
            />
            <OykButton
              type="submit"
              label="Create"
              color="accent"
              disabled={isSubmitting}
            />
          </div>
        </OykForm>
      )}
    />
  );
}
