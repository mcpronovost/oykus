import "@/assets/styles/pages/_profile.scss";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IconUser, IconPhoto } from "@tabler/icons-react";
import {
  queryKeys,
  updateProfileImages,
  type TypeProfileImages,
  type TypePublicUser,
} from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { resizeImageToWebpBase64 } from "@/utils";
import {
  OykBanner,
  OykButton,
  OykCard,
  OykForm,
  OykGrid,
  OykHeading,
  OykResult,
} from "@/components/ui";
import ImgUser from "@/assets/img/space-avatar-1.jpg";
import ImgCover from "@/assets/img/space-banner-1.jpg";

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

export default function OykProfile() {
  const { user } = useAuth();

  return user ? <ProfileImages key={user.id} user={user} /> : null;
}

function ProfileImages({ user }: { user: TypePublicUser }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<TypeProfileImages>({});
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isProcessing || isSubmitting;
  const hasChanges = Boolean(images.avatar || images.cover);

  const imageSource = (field: keyof TypeProfileImages) => {
    const preview = images[field];
    return preview ? `data:image/webp;base64,${preview}` : user[field];
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
    setSuccess(undefined);
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
    setImages({});
    setError(undefined);
    setSuccess(undefined);
  };

  const handleSubmit = async () => {
    if (isBusy || !hasChanges) return;

    setError(undefined);
    setSuccess(undefined);
    setIsSubmitting(true);
    try {
      const updated = await updateProfileImages(images);
      await queryClient.cancelQueries({ queryKey: queryKeys.user.me });
      queryClient.setQueryData<TypePublicUser | null>(queryKeys.user.me, (current) =>
        current?.id === updated.id
          ? {
              ...current,
              avatar: updated.avatar,
              cover: updated.cover,
              updatedAt: updated.updatedAt,
            }
          : current,
      );
      setImages({});
      setSuccess(t("Profile images saved."));
    } catch {
      setError(t("Could not update profile images."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="oyk-page-profile">
      <OykGrid>
        <OykHeading title={t("Profile")} suptitle={user.name} />
      </OykGrid>
      <OykForm loading={isBusy} onSubmit={handleSubmit}>
        <OykGrid>
          <OykGrid.Row>
            <OykGrid.Col size={{ xs: 24, sm: 24, md: 8, lg: 12 }}>
              <OykCard grow nop>
                <OykBanner
                  size={180}
                  coverSrc={imageSource("cover")}
                  coverAlt=""
                  coverSize={110}
                  avatarSrc={imageSource("avatar")}
                  avatarAlt={user.name}
                  avatarSize={120}
                  avatarTop={32}
                />
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
          <OykForm.Alert error={error} success={success} successTitle={t("Saved")} />
          <OykGrid.Row>
            <OykGrid.Col flex="horizontal" justify="end">
              <OykButton label={t("Reset")} variant="ghost" disabled={isBusy || !hasChanges} onClick={reset} />
              <OykButton type="submit" label={t("Save")} color="accent" disabled={isBusy || !hasChanges} loading={isSubmitting} />
            </OykGrid.Col>
          </OykGrid.Row>
        </OykGrid>
      </OykForm>
      <OykGrid>
        <OykResult
          title={t("Profile")}
          message={t("This is your profile page. You can view and edit your personal information here.")}
        />
      </OykGrid>
    </div>
  );
}
