import { useEffect, useRef, useState } from "react";
import { SquircleDashed, Image } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykCard,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykFormHelp,
  OykHeading,
  OykLoading,
} from "@/components/ui";

export default function UniverseAdminModuleBlog() {
  const { currentUniverse, getUniverses } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [initialBlogForm, setInitialBlogForm] = useState({});
  const [blogForm, setBlogForm] = useState(initialBlogForm);

  const fetchModuleData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/world/universes/${currentUniverse.slug}/modules/blog/`, signal ? { signal } : {});
      if (!r.ok || !r.module || !r.module.blog) throw Error();
      setInitialBlogForm((prev) => ({
        ...prev,
        ...r.module.blog.settings
      }));
      setBlogForm((prev) => ({
        ...prev,
        ...r.module.blog.settings
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
      let settings = {};
      for (const [key, value] of Object.entries(blogForm)) {
        settings[key] = value;
      };
      formData.append("settings", JSON.stringify(settings));
      const r = await api.post(`/world/universes/${currentUniverse.slug}/modules/blog/edit/`, formData);
      if (!r?.ok) throw new Error(r || t("An error occurred"));
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
    const { name, value, checked } = e.target;
    setBlogForm((prev) => ({
      ...prev,
      [name]: e.target.type === "checkbox" ? checked : value,
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

  const handleReset = async () => {
    setBlogForm(initialBlogForm);
  };

  useEffect(() => {
    const controller = new AbortController();

    routeTitle(`${t("Admin")} - ${t("Universe Blog Module")}`);

    fetchModuleData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-universes-admin-profile">
      <OykHeading subtitle tag="h2" title={t("Blog Module")} nop />
      <OykCard>
        {isLoading ? (
          <OykLoading />
        ) : (
          <OykForm className="oyk-universes-admin-form" isLoading={isLoading} onSubmit={handleSubmit}>
            <section>
              <OykFormField
                label={t("Display Name")}
                name="display_name"
                defaultValue={blogForm.display_name}
                onChange={handleChange}
                hasError={hasError?.display_name}
              />
              <OykFormField
                label={t("Allow Reactions")}
                name="is_reactions_enabled"
                type="checkbox"
                defaultValue={blogForm.is_reactions_enabled}
                onChange={handleChange}
                hasError={hasError?.is_reactions_enabled}
                helptext={blogForm.is_reactions_enabled ? t("Users can like and dislike posts") : null}
              />
              <OykFormField
                label={t("Allow Comments")}
                name="is_comments_enabled"
                type="checkbox"
                defaultValue={blogForm.is_comments_enabled}
                onChange={handleChange}
                hasError={hasError?.is_comments_enabled}
                helptext={blogForm.is_comments_enabled ? t("Users can leave comments") : null}
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
