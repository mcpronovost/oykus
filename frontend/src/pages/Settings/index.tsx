import "@/assets/styles/pages/_settings.scss";
import type { ChangeEvent, SubmitEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IconAlertTriangle, IconUpload } from "@tabler/icons-react";
import {
  ApiError,
  queryKeys,
  updateSpace,
  updateSpaceCover,
  type TypeSpace,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { resizeImageToCoverWebp } from "@/utils";
import {
  OykButton,
  OykCard,
  OykForm,
  OykGrid,
  OykHeading,
} from "@/components/ui";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";
import OykDashboardModalsSpaceDelete from "./modals/SpaceDelete";
import OykSettingsModalsSpaceDeactivate from "./modals/SpaceDeactivate";

type TypeSettingsForm = {
  name: string;
  description: string;
};

function spaceToForm(space: TypeSpace): TypeSettingsForm {
  return {
    name: space.name ?? "",
    description: space.description ?? "",
  };
}

export default function OykSettings() {
  const { user, refresh } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const space = user?.currentSpace ?? null;
  const spaceId = space?.id ?? null;
  const isOwner = Boolean(user && space && user.id === space.ownerId);

  const [form, setForm] = useState<TypeSettingsForm>({
    name: "",
    description: "",
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spaceToDeactivate, setSpaceToDeactivate] = useState<TypeSpace | null>(
    null,
  );
  const [spaceToDelete, setSpaceToDelete] = useState<TypeSpace | null>(null);

  useEffect(() => {
    if (!space) return;
    setForm(spaceToForm(space));
    setCoverBase64(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setCoverPreview(null);
  }, [space?.id, space?.name, space?.description, space?.cover, space?.isActive]);

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [space?.id]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  if (!user || !space || !spaceId) return null;

  const updateField = <K extends keyof TypeSettingsForm>(
    key: K,
    value: TypeSettingsForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSuccess(null);
  };

  const handleReset = () => {
    setForm(spaceToForm(space));
    setCoverBase64(null);
    setError(null);
    setSuccess(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCoverClick = () => {
    if (!isOwner || isSubmitting) return;
    fileInputRef.current?.click();
  };

  const handleCoverChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !isOwner) return;

    setError(null);
    setSuccess(null);
    try {
      const { base64, previewUrl } = await resizeImageToCoverWebp(file);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = previewUrl;
      setCoverPreview(previewUrl);
      setCoverBase64(base64);
    } catch {
      setError(t("Could not process the cover image."));
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOwner) return;

    setError(null);
    setSuccess(null);

    const name = form.name.trim();
    if (!name) {
      setError(t("Name is required."));
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSpace(spaceId, {
        name,
        description: form.description.trim(),
      });
      if (coverBase64) {
        await updateSpaceCover(spaceId, coverBase64);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.spaces.list }),
        refresh(),
      ]);
      setCoverBase64(null);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setCoverPreview(null);
      setSuccess(t("Space settings saved."));
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.fields
          ? Object.values(err.fields)
              .flatMap((value) => (Array.isArray(value) ? value : []))
              .filter((value): value is string => typeof value === "string")
          : [];
        setError(
          fieldErrors[0] || err.message || t("Could not update the space."),
        );
      } else {
        setError(t("Could not update the space."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const coverSrc = coverPreview || space.cover || ImgPlaceholder1;
  const isActive = space.isActive !== false;

  return (
    <div className="oyk-page-settings">
      <OykSettingsModalsSpaceDeactivate
        space={spaceToDeactivate}
        setSpace={setSpaceToDeactivate}
      />
      <OykDashboardModalsSpaceDelete
        space={spaceToDelete}
        setSpace={setSpaceToDelete}
      />
      <OykGrid>
        <OykHeading title={t("Settings")} suptitle={space.name} />
      </OykGrid>
      <OykForm id={formId} loading={isSubmitting} onSubmit={handleSubmit}>
        <OykGrid>
          <OykGrid.Row>
            <OykGrid.Col>
              <div className="oyk-page-settings-general">
                <div className="oyk-page-settings-general-cover">
                  <div className="oyk-page-settings-general-cover-img-wrapper">
                    <img
                      src={coverSrc}
                      alt={space.name}
                      className="oyk-page-settings-general-cover-img"
                    />
                    {isOwner ? (
                      <button
                        type="button"
                        className="oyk-page-settings-general-cover-btn"
                        disabled={isSubmitting}
                        onClick={handleCoverClick}
                        aria-label={t("Upload cover")}
                      >
                        <IconUpload size={64} stroke={1} />
                      </button>
                    ) : null}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        void handleCoverChange(event);
                      }}
                    />
                  </div>
                  <p className="oyk-page-settings-general-cover-size">400x568</p>
                </div>
                <OykCard>
                  <OykHeading
                    tag="h2"
                    title={t("General")}
                    subtitle={t("settings.general.subtitle")}
                    variant="card"
                  />
                  <OykGrid.Row nopb>
                    <OykGrid.Col>
                      <OykForm.Field
                        name="name"
                        label={t("Name")}
                        required
                        disabled={!isOwner || isSubmitting}
                        value={form.name}
                        onChange={(value) => updateField("name", value as string)}
                      />
                      <OykForm.Field
                        name="description"
                        type="textarea"
                        label={t("Description")}
                        disabled={!isOwner || isSubmitting}
                        value={form.description}
                        onChange={(value) =>
                          updateField("description", value as string)
                        }
                      />
                      <OykForm.Alert
                        error={error ?? undefined}
                        errorTitle={t("Could not update space")}
                        success={success ?? undefined}
                        successTitle={t("Saved")}
                      />
                    </OykGrid.Col>
                  </OykGrid.Row>
                  {isOwner ? (
                    <OykGrid.Row nopb>
                      <OykGrid.Col flex="horizontal" justify="end">
                        <OykButton
                          type="button"
                          label={t("Reset")}
                          variant="ghost"
                          disabled={isSubmitting}
                          onClick={handleReset}
                        />
                        <OykButton
                          type="submit"
                          form={formId}
                          label={t("Save")}
                          color="accent"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        />
                      </OykGrid.Col>
                    </OykGrid.Row>
                  ) : null}
                </OykCard>
              </div>
            </OykGrid.Col>
          </OykGrid.Row>
        </OykGrid>
      </OykForm>
      {isOwner ? (
        <OykGrid>
          <OykGrid.Row>
            <OykGrid.Col>
              <OykCard color="danger">
                <OykHeading
                  tag="h2"
                  title={t("settings.dangerzone.title")}
                  subtitle={t("settings.dangerzone.subtitle")}
                  icon={IconAlertTriangle}
                  variant="card"
                />
                <OykGrid.Row nopb>
                  <OykGrid.Col size={{ xs: 12, md: 18 }}>
                    <p className="oyk-page-settings-field-title">
                      {isActive
                        ? t("settings.dangerzone.deactivatespace")
                        : t("settings.dangerzone.reactivatespace")}
                    </p>
                    <small className="oyk-page-settings-field-description">
                      {isActive
                        ? t("settings.dangerzone.deactivatespacedescription")
                        : t("settings.dangerzone.reactivatespacedescription")}
                      <br />
                      {isActive
                        ? t("settings.dangerzone.deactivatespacenote")
                        : t("settings.dangerzone.reactivatespacenote")}
                    </small>
                  </OykGrid.Col>
                  <OykGrid.Col
                    size={{ xs: 12, md: 6 }}
                    flex="horizontal"
                    justify="end"
                  >
                    <OykButton
                      label={
                        isActive
                          ? t("settings.dangerzone.deactivatespace")
                          : t("settings.dangerzone.reactivatespace")
                      }
                      color={isActive ? "danger" : "accent"}
                      variant="ghost"
                      onClick={() => setSpaceToDeactivate(space)}
                    />
                  </OykGrid.Col>
                  <OykGrid.Col size={{ xs: 12, md: 18 }}>
                    <p className="oyk-page-settings-field-title">
                      {t("settings.dangerzone.deletespacemanually")}
                    </p>
                    <small className="oyk-page-settings-field-description">
                      {t("settings.dangerzone.deletespacemanuallydescription")}
                      <br />
                      {t("settings.dangerzone.deletespacemanuallynote")}
                    </small>
                  </OykGrid.Col>
                  <OykGrid.Col
                    size={{ xs: 12, md: 6 }}
                    flex="horizontal"
                    justify="end"
                  >
                    <OykButton
                      label={t("settings.dangerzone.deletespacemanually")}
                      color="danger"
                      onClick={() => setSpaceToDelete(space)}
                    />
                  </OykGrid.Col>
                </OykGrid.Row>
              </OykCard>
            </OykGrid.Col>
          </OykGrid.Row>
        </OykGrid>
      ) : null}
    </div>
  );
}
