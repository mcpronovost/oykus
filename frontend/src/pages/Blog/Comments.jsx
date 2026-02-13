import { useEffect, useState } from "react";
import { Frown, Pen, Trash2, Settings } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import {
  OykBanner,
  OykButton,
  OykCard,
  OykDropdown,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridCol,
  OykHeading,
  OykLoading,
} from "@/components/ui";

export default function OykBlogPost() {
  const { isAuth, currentUniverse } = useAuth();
  const { n, routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [post, setPost] = useState(null);

  const getBlogPost = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      setPost({
        title: "Test Title #1",
        description: "Medieval Tavern Ambience | Peaceful Celtic Music for Relaxation & Stress Relief",
        content:
          "Medieval Tavern Ambience | Peaceful Celtic Music for Relaxation & Stress Relief\nEscape to a cozy medieval tavern nestled in an enchanted forest. This relaxing Celtic and medieval music collection is perfect for sleep, study, work, meditation, and stress relief. Let the soothing sounds of lutes, harps, and flutes transport you to a world of tranquility and peace.",
      });
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(e.message || t("An error occurred"));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuth || (currentUniverse && !currentUniverse.modules?.blog?.active)) return;
    const controller = new AbortController();

    routeTitle(currentUniverse.modules.blog.settings.display_name || t("Blog"));

    // getBlogPost(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  if (
    !isAuth ||
    !currentUniverse ||
    !currentUniverse.modules?.blog?.active ||
    !currentUniverse.modules.blog.settings?.is_comments_enabled
  ) {
    return null;
  }

  return (
    <section className="oyk-blog-comments">
      <OykHeading title={t("Comments")} subtitle nop />
      <OykCard>
        <OykFeedback title={t("Under Construction")} variant="primary" ghost />
      </OykCard>
    </section>
  );
}
