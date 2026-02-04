import { useEffect, useRef, useState } from "react";
import { User, Image } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykBanner, OykButton, OykCard, OykForm, OykFormField, OykFormMessage, OykHeading } from "@/components/ui";

export default function UniverseAdminProfile() {
  const { setUser, currentUniverse } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const logoRef = useRef(null);
  const coverRef = useRef(null);
  const nameRef = useRef(null);
  const slugRef = useRef(null);
  const abbrRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [profileForm, setProfileForm] = useState({
    logo: currentUniverse.logo || null,
    cover: currentUniverse.cover || null,
    name: currentUniverse.name || "",
    slug: currentUniverse.slug || "",
    abbr: currentUniverse.abbr || "",
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
      [field]: null,
    }));
    if (field === "logo") logoRef.current?.click();
    if (field === "cover") coverRef.current?.click();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional validation
    if (file.size > 2 * 1024 * 1024) {
      setHasError({ logo: t("Logo image must be smaller than 2MB") });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setProfileForm((prev) => ({
      ...prev,
      logo: previewUrl,
      logoFile: file,
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
      logo: currentUniverse.logo || null,
      cover: currentUniverse.cover || null,
      name: currentUniverse.name || "",
      slug: currentUniverse.slug || "",
      abbr: currentUniverse.abbr || "",
    });
    nameRef.current.value = currentUniverse.name || "";
    slugRef.current.value = currentUniverse.slug || "";
    abbrRef.current.value = currentUniverse.abbr || "";
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      if (profileForm.logoFile) {
        formData.append("logo", profileForm.logoFile);
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
        abbr: r.user.abbr,
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
      if (profileForm.logo?.startsWith("blob:")) {
        URL.revokeObjectURL(profileForm.logo);
      }
      if (profileForm.cover?.startsWith("blob:")) {
        URL.revokeObjectURL(profileForm.cover);
      }
    };
  }, [profileForm.logo, profileForm.cover]);

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Profile")}`);

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
            <OykBanner
              avatarAbbr={profileForm.abbr}
              avatarSize={80}
              avatarBorderSize={8}
              avatarTop={48}
              avatarSrc={profileForm.logo}
              coverSrc={profileForm.cover}
              height={150}
            />
            {(hasError?.logo || hasError?.cover) && (
              <OykFormMessage hasError={hasError?.logo || hasError?.cover} style={{ margin: "0 16px 16px" }} />
            )}
          </OykCard>
        </div>
        <div className="oyk-settings-profile-visual-avatar">
          <OykCard fh clickable onClick={() => handleImageClick("logo")}>
            <User size={24} color={"var(--oyk-c-primary)"} />
            <p className="oyk-settings-profile-visual-avatar-title">{t("Change Logo")}</p>
            <small className="oyk-settings-profile-visual-avatar-max">{t("200x200px (max 2MB)")}</small>
            <input
              ref={logoRef}
              name="logo"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              hidden
              onChange={handleLogoChange}
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
        <OykHeading subtitle tag="h2" title={t("Universe Profile")} nop />
        <OykForm className="oyk-settings-form" isLoading={isLoading} onSubmit={handleSubmit}>
          <OykFormField
            ref={nameRef}
            label={t("Name")}
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
          {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
          <div className="oyk-form-actions">
            <OykButton type="submit" color="primary" disabled={isLoading}>
              {isLoading ? t("Saving...") : t("Save")}
            </OykButton>
            <OykButton type="reset" disabled={isLoading} outline onClick={handleReset}>
              {t("Cancel")}
            </OykButton>
          </div>
        </OykForm>
      </OykCard>
    </section>
  );
}
