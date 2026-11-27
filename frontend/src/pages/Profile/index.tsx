import "@/assets/styles/pages/_profile.scss";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IconCircleDashedX, IconUser, IconPhoto, IconAlertTriangle } from "@tabler/icons-react";
import {
  queryKeys,
  updateProfile,
  type TypeProfileDetails,
  type TypeProfileImages,
  type TypePublicUser,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { SUPPORTED_LANGS } from "@/services/translation/utils";
import { resizeImageToWebpBase64 } from "@/utils";
import {
  OykBanner,
  OykButton,
  OykCard,
  OykForm,
  OykGrid,
  OykHeading,
} from "@/components/ui";
import OykProfileModalsAccountDelete from "./modals/AccountDelete";

const PROFILE_IMAGES = {
  avatar: {
    width: 200,
    height: 200,
    label: "Change Avatar",
    error: "Could not process the avatar image.",
    Icon: IconUser,
  },
  cover: {
    width: 1600,
    height: 300,
    label: "Change Cover",
    error: "Could not process the cover image.",
    Icon: IconPhoto,
  },
};

const LANGUAGE_LABELS = { fr: "French", en: "English" };
const PROFILE_TIMEZONES = ["UTC", "America/Toronto", "Europe/Paris"];

export default function OykProfile() {
  const { user } = useAuth();

  return user ? <ProfileForm key={user.id} user={user} /> : null;
}

function ProfileForm({ user }: { user: TypePublicUser }) {
  const { lang, t } = useTranslation();
  const { n } = useRouter();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<TypeProfileImages>({});
  const [details, setDetails] = useState<TypeProfileDetails>({});
  const [error, setError] = useState<string>();
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isBusy = isProcessing || isSubmitting;
  const hasChanges = Object.keys(details).length > 0 || Object.keys(images).length > 0;
  const timezoneOptions = [...new Set([...PROFILE_TIMEZONES, user.timezone])];

  const changeDetail = (field: keyof TypeProfileDetails, value: string | boolean | string[]) => {
    if (typeof value !== "string") return;
    setError(undefined);
    setIsSaved(false);
    setDetails((current) => {
      const next = { ...current };
      if (value === user[field]) delete next[field];
      else next[field] = value;
      return next;
    });
  };

  const imageSource = (field: keyof TypeProfileImages) => {
    const preview = images[field];
    if (preview === undefined) return user[field];
    return preview ? `data:image/webp;base64,${preview}` : null;
  };

  const avatarSource = imageSource("avatar");
  const coverSource = imageSource("cover");

  const removeImage = (field: keyof TypeProfileImages) => {
    if (isBusy) return;
    setError(undefined);
    setIsSaved(false);
    setImages((current) => ({ ...current, [field]: "" }));
  };

  const handleImageChange = async (
    field: keyof TypeProfileImages,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || isBusy) return;

    const { width, height, error: imageError } = PROFILE_IMAGES[field];
    setError(undefined);
    setIsSaved(false);
    setIsProcessing(true);
    try {
      const base64 = await resizeImageToWebpBase64(file, width, height);
      setImages((current) => ({ ...current, [field]: base64 }));
    } catch {
      setError(t(imageError));
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setDetails({});
    setImages({});
    setError(undefined);
    setIsSaved(false);
  };

  const handleSubmit = async () => {
    if (isBusy || !hasChanges) return;

    setError(undefined);
    setIsSaved(false);
    if (details.name !== undefined && !details.name.trim()) {
      setError(t("Enter a name."));
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateProfile({ ...details, ...images });
      await queryClient.cancelQueries({ queryKey: queryKeys.user.me });
      queryClient.setQueryData<TypePublicUser | null>(queryKeys.user.me, (current) =>
        current?.id === updated.id
          ? {
              ...current,
              name: updated.name,
              language: updated.language,
              timezone: updated.timezone,
              avatar: updated.avatar,
              cover: updated.cover,
              updatedAt: updated.updatedAt,
            }
          : current,
      );
      setDetails({});
      setImages({});
      setIsSaved(true);
      const savedLanguage = SUPPORTED_LANGS.find((language) => language === updated.language);
      if (details.language !== undefined && savedLanguage && savedLanguage !== lang) {
        n("profile", {}, savedLanguage);
      }
    } catch {
      setError(t("Could not update your profile."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="oyk-page-profile">
      <OykProfileModalsAccountDelete
        name={user.name}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />
      <OykGrid>
        <OykHeading title={t("Profile")} suptitle={user.name} />
      </OykGrid>
      <OykForm loading={isBusy} onSubmit={handleSubmit}>
        <OykGrid>
          <OykGrid.Row>
            <OykGrid.Col size={{ xs: 24, sm: 24, md: 8, lg: 12 }}>
              <OykCard grow nop>
                <OykBanner
                  size={160}
                  coverSrc={coverSource}
                  coverAlt=""
                  coverSize={110}
                  coverClickable={!isBusy && Boolean(coverSource)}
                  coverClickIcon={IconCircleDashedX}
                  coverClickLabel={t("Remove Cover")}
                  coverOnClick={() => removeImage("cover")}
                  avatarSrc={avatarSource}
                  avatarAlt={user.name}
                  avatarSize={120}
                  avatarTop={32}
                  avatarClickable={!isBusy && Boolean(avatarSource)}
                  avatarClickIcon={IconCircleDashedX}
                  avatarClickLabel={t("Remove Avatar")}
                  avatarOnClick={() => removeImage("avatar")}
                />
                <p className="oyk-page-profile-bannerpreview-name">{details.name ?? user.name}</p>
              </OykCard>
            </OykGrid.Col>
            {(["avatar", "cover"] as const).map((field) => {
              const { width, height, label, Icon } = PROFILE_IMAGES[field];
              const inputRef = field === "avatar" ? avatarInputRef : coverInputRef;
              return (
                <OykGrid.Col key={field} size={{ xs: 24, sm: 12, md: 8, lg: 6 }}>
                  <OykCard grow nop clickable={!isBusy}>
                    <button
                      type="button"
                      className="oyk-page-profile-bannerpreview-upload"
                      disabled={isBusy}
                      onClick={() => inputRef.current?.click()}
                    >
                      <Icon size={24} stroke={1.5} aria-hidden="true" />
                      <span>{t(label)}</span>
                      <small>{width} × {height}</small>
                    </button>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={isBusy}
                      onChange={(event) => void handleImageChange(field, event)}
                    />
                  </OykCard>
                </OykGrid.Col>
              );
            })}
          </OykGrid.Row>
          <OykCard>
            <OykHeading title={t("Your Identity")} variant="card" />
            <OykGrid.Row nopb>
              <OykGrid.Col>
                <OykForm.Field
                  name="name"
                  label={t("Name")}
                  value={details.name ?? user.name}
                  onChange={(value) => changeDetail("name", value)}
                  required
                  max={100}
                  disabled={isBusy}
                />
              </OykGrid.Col>
              <OykGrid.Col size={{ xs: 24, md: 12 }}>
                <OykForm.Field
                  name="language"
                  label={t("Language")}
                  type="select"
                  options={SUPPORTED_LANGS.map((value) => ({ value, label: t(LANGUAGE_LABELS[value]) }))}
                  value={details.language ?? user.language}
                  onChange={(value) => changeDetail("language", value)}
                  disabled={isBusy}
                />
              </OykGrid.Col>
              <OykGrid.Col size={{ xs: 24, md: 12 }}>
                <OykForm.Field
                  name="timezone"
                  label={t("Time zone")}
                  type="select"
                  options={timezoneOptions.map((value) => ({ value, label: value }))}
                  value={details.timezone ?? user.timezone}
                  onChange={(value) => changeDetail("timezone", value)}
                  disabled={isBusy}
                />
              </OykGrid.Col>
              <OykGrid.Col>
                <OykForm.Alert error={error} success={isSaved ? t("Profile saved.") : undefined} successTitle={t("Saved")} />
              </OykGrid.Col>
              <OykGrid.Col flex="horizontal" justify="end">
                <OykButton label={t("Reset")} variant="ghost" disabled={isBusy || !hasChanges} onClick={reset} />
                <OykButton type="submit" label={t("Save")} color="accent" disabled={isBusy || !hasChanges} loading={isSubmitting} />
              </OykGrid.Col>
            </OykGrid.Row>
          </OykCard>
        </OykGrid>
      </OykForm>
      <OykGrid>
        <OykGrid.Row>
          <OykGrid.Col>
            <OykCard color="danger">
              <OykHeading
                tag="h2"
                title={t("profile.dangerzone.title")}
                subtitle={t("profile.dangerzone.subtitle")}
                icon={IconAlertTriangle}
                variant="card"
              />
              <OykGrid.Row nopb>
                <OykGrid.Col size={{ xs: 12, md: 18 }}>
                  <p className="oyk-page-profile-field-title">
                    {t("profile.dangerzone.deleteuserpermanently")}
                  </p>
                  <small className="oyk-page-profile-field-description">
                    {t("profile.dangerzone.deleteuserpermanentlydescription")}
                    <br />
                    {t("profile.dangerzone.deleteuserpermanentlynote")}
                  </small>
                </OykGrid.Col>
                <OykGrid.Col
                  size={{ xs: 12, md: 6 }}
                  flex="horizontal"
                  justify="end"
                >
                  <OykButton
                    label={t("profile.dangerzone.deleteuserpermanently")}
                    color="danger"
                    disabled={isBusy}
                    onClick={() => setIsDeleteOpen(true)}
                  />
                </OykGrid.Col>
              </OykGrid.Row>
            </OykCard>
          </OykGrid.Col>
        </OykGrid.Row>
      </OykGrid>
    </div>
  );
}
