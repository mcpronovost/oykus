import type { SubmitEvent } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconPlus } from "@tabler/icons-react";
import {
  OykButton,
  OykCard,
  OykDivider,
  OykForm,
  OykGrid,
  OykHeading,
  OykModal,
  OykResult,
} from "@/components/ui";
import { ApiError, createSpace, listSpaces, queryKeys } from "@/services/api";
import { useAuth } from "@/services/auth";
import { getTimeGreeting } from "@/utils";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";
import ImgPlaceholder2 from "@/assets/img/space-cover-2.webp";

const INITIAL_FORM = {
  name: "",
  description: "",
};

export default function OykDashboard() {
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: spaces = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.spaces.list,
    queryFn: listSpaces,
  });

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
    <div className="oyk-page-dashboard">
      <OykGrid>
        <OykHeading
          title={user?.name}
          suptitle={getTimeGreeting()}
          subtitle="Here's what's happening with your worlds"
          actions={
            <OykButton
              label="New Space"
              color="accent"
              icon={IconPlus}
              onClick={() => setModalOpen(true)}
            />
          }
        />

        {isPending ? (
          <OykResult
            title="Loading spaces"
            message="Fetching your worlds..."
            variant="ghost"
          />
        ) : isError ? (
          <OykResult
            title="Could not load spaces"
            message="Something went wrong while fetching your spaces."
            color="danger"
            variant="ghost"
          >
            <OykButton
              label="Try again"
              color="accent"
              onClick={() => refetch()}
            />
          </OykResult>
        ) : spaces.length === 0 ? (
          <OykResult
            title="No spaces found"
            message="Create a new space to get started"
            variant="ghost"
          />
        ) : (
          <OykGrid.Row>
            <OykGrid.Col>
              <OykCard outlined hoverable gradient="accent">
                <div
                  style={{
                    backgroundColor: "var(--oyk-card-bg)",
                    backgroundImage: `url(${ImgPlaceholder1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid var(--oyk-c-accent-faint)",
                    borderRadius: "var(--oyk-radius)",
                    width: "180px",
                    height: "256px",
                  }}
                ></div>
              </OykCard>
            </OykGrid.Col>
            <OykGrid.Col>
              <OykDivider start="Your worlds" end={`${spaces.length} spaces`} />
            </OykGrid.Col>
            <OykGrid.Col flex="horizontal">
              {spaces.map((space, index) => (
                <div>
                  <OykCard key={space.id} hoverable nop>
                    <div
                      style={{
                        backgroundImage: `url(${index === 0 ? ImgPlaceholder1 : ImgPlaceholder2})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "var(--oyk-radius)",
                        width: "180px",
                        height: "256px",
                      }}
                    ></div>
                  </OykCard>
                  <p>{space.name}</p>
                  {user?.currentSpaceId === space.id ? (
                    <p style={{ marginBottom: 0, opacity: 0.7 }}>
                      Current space
                    </p>
                  ) : null}
                </div>
              ))}
            </OykGrid.Col>
          </OykGrid.Row>
        )}
      </OykGrid>

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
    </div>
  );
}
