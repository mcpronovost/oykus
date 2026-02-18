import { useEffect, useRef, useState } from "react";
import { SquircleDashed, Image } from "lucide-react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import {
  OykBanner,
  OykButton,
  OykCard,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykHeading,
  OykLoading,
} from "@/components/ui";

export default function UniverseAdminTheme() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse, getUniverses } = useWorld();

  const logoRef = useRef(null);
  const coverRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initialThemeForm, setInitialThemeForm] = useState({
    logo: currentUniverse.logo || null,
    cover: currentUniverse.cover || null,
  });
  const [themeForm, setThemeForm] = useState(initialThemeForm);

  const fetchThemeData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/world/universes/${currentUniverse.slug}/theme/`, signal ? { signal } : {});
      if (!r.ok || !r.theme) throw Error();
      const payload = {
        c_primary: r.theme.c_primary,
        c_primary_fg: r.theme.c_primary_fg
      };
      for (const [key, value] of Object.entries(r.theme.variables)) {
        if (key === "radius") {
          payload.radius = value.replace("px", "");
        } else {
          payload[key.replaceAll("-", "_")] = value;
        }
      };
      setInitialThemeForm((prev) => ({
        ...prev,
        ...payload
      }));
      setThemeForm((prev) => ({
        ...prev,
        ...payload
      }));
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError({
        message: e.message || t("An error occurred"),
      });
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    setHasError(null);
    try {
      const formData = new FormData();
      let variables = {};
      for (const [key, value] of Object.entries(themeForm)) {
        if (key !== "logo" && key !== "logoFile" && key !== "cover" && key !== "coverFile") {
          if (key !== "c_primary" && key !== "c_primary_fg") {
            variables[key.replaceAll("_", "-")] = `${value}`.toUpperCase();
          } else {
            formData.append(key, value);
          }
        };
      };
      formData.append("variables", JSON.stringify(variables));
      if (themeForm.logoFile) {
        formData.append("logo", themeForm.logoFile);
      }
      if (themeForm.coverFile) {
        formData.append("cover", themeForm.coverFile);
      }
      const r = await api.post(`/world/universes/${currentUniverse.slug}/theme/edit/`, formData);
      if (!r?.ok || !r.theme) throw new Error(r || t("An error occurred"));
      setThemeForm((prev) => ({
        ...prev,
        c_primary: r.theme.c_primary,
        c_primary_fg: r.theme.c_primary_fg,
      }));
      getUniverses();
    } catch (e) {
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setThemeForm((prev) => ({
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

    setThemeForm((prev) => ({
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

    setThemeForm((prev) => ({
      ...prev,
      cover: previewUrl,
      coverFile: file,
    }));
  };

  const handleReset = async () => {
    setThemeForm(initialThemeForm);
  };

  useEffect(() => {
    return () => {
      if (themeForm.logo?.startsWith("blob:")) {
        URL.revokeObjectURL(themeForm.logo);
      }
      if (themeForm.cover?.startsWith("blob:")) {
        URL.revokeObjectURL(themeForm.cover);
      }
    };
  }, [themeForm.logo, themeForm.cover]);

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Universe Theme")}`);

    fetchThemeData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-profile">
      <article className="oyk-universes-admin-profile-visual">
        <div className="oyk-universes-admin-profile-visual-preview">
          <OykCard nop fullCenter alignTop>
            <OykBanner
              avatarAbbr={currentUniverse.abbr}
              avatarSize={80}
              avatarBorderSize={6}
              avatarBorderRadius="8px"
              avatarTop={48}
              avatarSrc={themeForm.logo}
              coverSrc={themeForm.cover}
              height={150}
            />
            {(hasError?.logo || hasError?.cover) && (
              <OykFormMessage hasError={hasError?.logo || hasError?.cover} style={{ margin: "0 16px 16px" }} />
            )}
          </OykCard>
        </div>
        <div className="oyk-universes-admin-profile-visual-avatar">
          <OykCard fullCenter clickable onClick={() => handleImageClick("logo")}>
            <SquircleDashed size={24} color={"var(--oyk-c-primary)"} />
            <p className="oyk-universes-admin-profile-visual-avatar-title">{t("Change Logo")}</p>
            <small className="oyk-universes-admin-profile-visual-avatar-max">{t("200x200px (max 2MB)")}</small>
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
        <div className="oyk-universes-admin-profile-visual-cover">
          <OykCard fullCenter clickable onClick={() => handleImageClick("cover")}>
            <Image size={24} color={"var(--oyk-c-primary)"} />
            <p className="oyk-universes-admin-profile-visual-cover-title">{t("Change Cover")}</p>
            <small className="oyk-universes-admin-profile-visual-cover-max">{t("1136x256px (max 2MB)")}</small>
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
        {isLoading ? (
          <OykLoading />
        ) : (
          <OykForm className="oyk-universes-admin-form" isLoading={isLoading} onSubmit={handleSubmit}>
            <section>
              <OykHeading subtitle tag="h2" title={t("Universe Theme")} nop />
              <OykFormField
                label={t("Primary Colour")}
                name="c_primary"
                type="color"
                defaultValue={themeForm.c_primary}
                onChange={handleChange}
                hasError={hasError?.c_primary}
              />
              <OykFormField
                label={t("Foreground Primary Colour")}
                name="c_primary_fg"
                type="color"
                defaultValue={themeForm.c_primary_fg}
                onChange={handleChange}
                hasError={hasError?.c_primary_fg}
              />
              <OykFormField
                label={t("Border Radius")}
                name="radius"
                type="number"
                defaultValue={themeForm.radius}
                onChange={handleChange}
                hasError={hasError?.radius}
              />
            </section>
            <hr />
            <section>
              <OykHeading subtitle tag="h3" title={t("Core Colours")} nop />
              <OykFormField
                label={t("Core Background")}
                name="core_bg"
                type="color"
                defaultValue={themeForm.core_bg}
                onChange={handleChange}
                hasError={hasError?.core_bg}
              />
              <OykFormField
                label={t("Core Foreground")}
                name="core_fg"
                type="color"
                defaultValue={themeForm.core_fg}
                onChange={handleChange}
                hasError={hasError?.core_fg}
              />
              <OykFormField
                label={t("Core Divider")}
                name="core_divider"
                type="color"
                defaultValue={themeForm.core_divider}
                onChange={handleChange}
                hasError={hasError?.core_divider}
              />
            </section>
            <hr />
            <section>
              <OykHeading subtitle tag="h3" title={t("Header Colours")} nop />
              <OykFormField
                label={t("Header Background")}
                name="app_header_bg"
                type="color"
                defaultValue={themeForm.app_header_bg}
                onChange={handleChange}
                hasError={hasError?.app_header_bg}
              />
              <OykFormField
                label={t("Header Foreground")}
                name="app_header_fg"
                type="color"
                defaultValue={themeForm.app_header_fg}
                onChange={handleChange}
                hasError={hasError?.app_header_fg}
              />
              <OykFormField
                label={t("Header Subtle Background")}
                name="app_header_subtle_bg"
                type="color"
                defaultValue={themeForm.app_header_subtle_bg}
                onChange={handleChange}
                hasError={hasError?.app_header_subtle_bg}
              />
              <OykFormField
                label={t("Header Subtle Foreground")}
                name="app_header_subtle_fg"
                type="color"
                defaultValue={themeForm.app_header_subtle_fg}
                onChange={handleChange}
                hasError={hasError?.app_header_subtle_fg}
              />
            </section>
            <hr />
            <section>
              <OykHeading subtitle tag="h3" title={t("Sidebar Colours")} nop />
              <OykFormField
                label={t("Sidebar Background")}
                name="app_sidebar_bg"
                type="color"
                defaultValue={themeForm.app_sidebar_bg}
                onChange={handleChange}
                hasError={hasError?.app_sidebar_bg}
              />
              <OykFormField
                label={t("Sidebar Foreground")}
                name="app_sidebar_fg"
                type="color"
                defaultValue={themeForm.app_sidebar_fg}
                onChange={handleChange}
                hasError={hasError?.app_sidebar_fg}
              />
              <OykFormField
                label={t("Sidebar Subtle Background")}
                name="app_sidebar_subtle_bg"
                type="color"
                defaultValue={themeForm.app_sidebar_subtle_bg}
                onChange={handleChange}
                hasError={hasError?.app_sidebar_subtle_bg}
              />
              <OykFormField
                label={t("Sidebar Subtle Foreground")}
                name="app_sidebar_subtle_fg"
                type="color"
                defaultValue={themeForm.app_sidebar_subtle_fg}
                onChange={handleChange}
                hasError={hasError?.app_sidebar_subtle_fg}
              />
            </section>
            <hr />
            <section>
              <OykHeading subtitle tag="h3" title={t("Card Colours")} nop />
              <OykFormField
                label={t("Card Background")}
                name="card_bg"
                type="color"
                defaultValue={themeForm.card_bg}
                onChange={handleChange}
                hasError={hasError?.card_bg}
              />
              <OykFormField
                label={t("Card Foreground")}
                name="card_fg"
                type="color"
                defaultValue={themeForm.card_fg}
                onChange={handleChange}
                hasError={hasError?.card_fg}
              />
              <OykFormField
                label={t("Card Subtle Background")}
                name="card_subtle_bg"
                type="color"
                defaultValue={themeForm.card_subtle_bg}
                onChange={handleChange}
                hasError={hasError?.card_subtle_bg}
              />
              <OykFormField
                label={t("Card Subtle Foreground")}
                name="card_subtle_fg"
                type="color"
                defaultValue={themeForm.card_subtle_fg}
                onChange={handleChange}
                hasError={hasError?.card_subtle_fg}
              />
              <OykFormField
                label={t("Card Item Background")}
                name="card_item_bg"
                type="color"
                defaultValue={themeForm.card_item_bg}
                onChange={handleChange}
                hasError={hasError?.card_item_bg}
              />
              <OykFormField
                label={t("Card Item Foreground")}
                name="card_item_fg"
                type="color"
                defaultValue={themeForm.card_item_fg}
                onChange={handleChange}
                hasError={hasError?.card_item_fg}
              />
              <OykFormField
                label={t("Card Divider")}
                name="card_divider"
                type="color"
                defaultValue={themeForm.card_divider}
                onChange={handleChange}
                hasError={hasError?.card_divider}
              />
            </section>
            <hr />
            <section>
              <OykHeading subtitle tag="h3" title={t("Popper Colours")} nop />
              <OykFormField
                label={t("Popper Background")}
                name="popper_bg"
                type="color"
                defaultValue={themeForm.popper_bg}
                onChange={handleChange}
                hasError={hasError?.popper_bg}
              />
              <OykFormField
                label={t("Popper Foreground")}
                name="popper_fg"
                type="color"
                defaultValue={themeForm.popper_fg}
                onChange={handleChange}
                hasError={hasError?.popper_fg}
              />
              <OykFormField
                label={t("Popper Subtle Background")}
                name="popper_subtle_bg"
                type="color"
                defaultValue={themeForm.popper_subtle_bg}
                onChange={handleChange}
                hasError={hasError?.popper_subtle_bg}
              />
              <OykFormField
                label={t("Popper Subtle Foreground")}
                name="popper_subtle_fg"
                type="color"
                defaultValue={themeForm.popper_subtle_fg}
                onChange={handleChange}
                hasError={hasError?.popper_subtle_fg}
              />
            </section>
            <hr />
            <section>
              <OykHeading subtitle tag="h3" title={t("Scrollbar Colours")} nop />
              <OykFormField
                label={t("Scrollbar Foreground")}
                name="scrollbar"
                type="color"
                defaultValue={themeForm.scrollbar}
                onChange={handleChange}
                hasError={hasError?.scrollbar}
              />
            </section>
            {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
            <div className="oyk-form-actions">
              <OykButton type="submit" color="primary" disabled={isLoading || isLoadingSubmit} isLoading={isLoadingSubmit}>
                {t("Save")}
              </OykButton>
              <OykButton type="reset" disabled={isLoading || isLoadingSubmit} outline onClick={handleReset}>
                {t("Cancel")}
              </OykButton>
            </div>
          </OykForm>
        )}
      </OykCard>
    </section>
  );
}
