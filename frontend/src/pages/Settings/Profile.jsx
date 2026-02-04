import { useEffect, useRef, useState } from "react";
import { User, Image } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykBanner, OykButton, OykCard, OykForm, OykFormField, OykFormMessage } from "@/components/ui";

export default function SettingsProfile() {
  const { currentUser, setUser } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const avatarRef = useRef(null);
  const coverRef = useRef(null);
  const nameRef = useRef(null);
  const slugRef = useRef(null);
  const abbrRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [profileForm, setProfileForm] = useState({
    avatar: currentUser.avatar || null,
    cover: currentUser.cover || null,
    name: currentUser.name || "",
    slug: currentUser.slug || "",
    abbr: currentUser.abbr || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (hasError?.fields?.[name]) {
      setHasError((prev) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [name]: "",
        },
      }));
    }
  };
  
  const handleImageClick = (field) => {
    setHasError((prev) => ({
      ...prev,
      [field]: null
    }));
    if (field === "avatar") avatarRef.current?.click();
    if (field === "cover") coverRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional validation
    if (file.size > 2 * 1024 * 1024) {
      setHasError({ avatar: t("Avatar image must be smaller than 2MB") });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setProfileForm((prev) => ({
      ...prev,
      avatar: previewUrl,
      avatarFile: file,
    }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional validation
    if (file.size > 2 * 1024 * 1024) {
      setHasError({ cover: t("Cover image must be smaller than 2MB") });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setProfileForm((prev) => ({
      ...prev,
      cover: previewUrl,
      coverFile: file,
    }));
  };

  const handleReset = async (e) => {
    setProfileForm({
      avatar: currentUser.avatar || null,
      cover: currentUser.cover || null,
      name: currentUser.name || "",
      slug: currentUser.slug || "",
      abbr: currentUser.abbr || ""
    });
    nameRef.current.value = currentUser.name || "";
    slugRef.current.value = currentUser.slug || "";
    abbrRef.current.value = currentUser.abbr || "";
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      if (profileForm.avatarFile) {
        formData.append("avatar", profileForm.avatarFile);
      }
      if (profileForm.coverFile) {
        formData.append("cover", profileForm.coverFile);
      }
      const r = await api.post("/auth/me/edit/", formData);
      if (!r?.ok) throw new Error(r || t("An error occurred"));
      setUser(r.user);
      setProfileForm((prev) => ({
        ...prev,
        name: r.user.name,
        slug: r.user.slug,
        abbr: r.user.abbr
      }));
      nameRef.current.value = r.user.name;
      slugRef.current.value = r.user.slug;
      abbrRef.current.value = r.user.abbr;
    } catch (e) {
      if (e?.message && e.message.includes("uniq_name")) {
        setHasError(() => ({
          name: t("This name is already in use"),
        }));
      } else {
        setHasError(() => ({
          message: e.message || t("An error occurred"),
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (profileForm.avatar?.startsWith("blob:")) {
        URL.revokeObjectURL(profileForm.avatar);
      }
      if (profileForm.cover?.startsWith("blob:")) {
        URL.revokeObjectURL(profileForm.cover);
      }
    };
  }, [profileForm.avatar, profileForm.cover]);
  
  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Settings")} - ${t("Profile")}`);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-settings-profile">
      <article className="oyk-settings-profile-visual">
        <div className="oyk-settings-profile-visual-preview">
          <OykCard nop fh alignTop>
            <OykBanner avatarSize={80} avatarBorderSize={8} avatarTop={48} avatarSrc={profileForm.avatar} coverSrc={profileForm.cover} height={150} />
            {(hasError?.avatar || hasError?.cover) && (
              <OykFormMessage hasError={hasError?.avatar || hasError?.cover} style={{margin: "0 16px 16px"}} />
            )}
          </OykCard>
        </div>
        <div className="oyk-settings-profile-visual-avatar">
          <OykCard fh clickable onClick={() => handleImageClick("avatar")}>
            <User size={24} color={"var(--oyk-c-primary)"} />
            <p className="oyk-settings-profile-visual-avatar-title">{t("Change Avatar")}</p>
            <small className="oyk-settings-profile-visual-avatar-max">{t("200x200px (max 2MB)")}</small>
            <input
              ref={avatarRef}
              name="avatar"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              hidden
              onChange={handleAvatarChange}
            />
          </OykCard>
        </div>
        <div className="oyk-settings-profile-visual-cover">
          <OykCard fh clickable onClick={() => handleImageClick("cover")}>
            <Image size={24} color={"var(--oyk-c-primary)"} />
            <p className="oyk-settings-profile-visual-cover-title">{t("Change Cover")}</p>
            <small className="oyk-settings-profile-visual-cover-max">{t("1136x256px (max 2MB)")}</small>
            <input
              ref={coverRef}
              name="cover"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              hidden
              onChange={handleCoverChange}
            />
          </OykCard>
        </div>
      </article>
      <OykCard>
        <OykForm className="oyk-settings-form" isLoading={isLoading} onSubmit={handleSubmit}>
          <h2 className="oyk-settings-form-title">{t("Your Profile")}</h2>
          <OykFormField
            ref={nameRef}
            label={t("Public Name")}
            name="name"
            defaultValue={profileForm.name}
            onChange={handleChange}
            hasError={hasError?.name}
            required
          />
          <OykFormField
            ref={slugRef}
            label={t("Slug")}
            name="slug"
            defaultValue={profileForm.slug}
            onChange={handleChange}
            hasError={hasError?.slug}
            required
            disabled
          />
          <OykFormField
            ref={abbrRef}
            label={t("Abbreviation")}
            name="abbr"
            defaultValue={profileForm.abbr}
            onChange={handleChange}
            hasError={hasError?.abbr}
            required
            disabled
          />
          {hasError?.message && (
            <OykFormMessage hasError={hasError?.message} />
          )}
          <div className="oyk-form-actions">
            <OykButton
              type="submit"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? t("Saving...") : t("Save")}
            </OykButton>
            <OykButton
              type="reset"
              disabled={isLoading}
              outline
              onClick={handleReset}
            >
              {t("Cancel")}
            </OykButton>
          </div>
        </OykForm>
      </OykCard>
    </section>
  );
}
