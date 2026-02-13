import { useEffect, useState } from "react";
import { Frown, Pen, ThumbsDown, ThumbsUp, Trash2, Settings } from "lucide-react";

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
  OykHeading,
  OykLoading,
} from "@/components/ui";
import { oykDate } from "@/utils";
import OykBlogComments from "./Comments";

export default function OykBlogPost() {
  const { isAuth, currentUser, currentUniverse } = useAuth();
  const { routeTitle, params } = useRouter();
  const { t, lang } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [post, setPost] = useState(null);

  const getBlogPost = async (signal) => {
    if (!params?.postId) return;

    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/blog/u/${currentUniverse.slug}/posts/${params.postId}`, signal ? { signal } : {});
      if (!r.ok || !r.post) throw Error();
      setPost(r.post);
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

    getBlogPost(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  if (!isAuth || !currentUniverse || (currentUniverse && !currentUniverse.modules?.blog?.active)) {
    return <AppNotAuthorized />;
  }

  return (
    <section className="oyk-page oyk-blog">
      <OykGrid>
        {hasError ? (
          <OykFeedback ghost title={t("An error occurred")} message={t(hasError.message)} variant="danger" />
        ) : isLoading ? (
          <OykLoading />
        ) : post ? (
          <section>
            <OykHeading
              nop
              title={post.title}
              description={post.description}
              actions={
                <>
                  {/*<OykButton color="primary" outline onClick={() => {}}>
                    General
                  </OykButton>*/}
                  {currentUniverse.role === 1 ? (
                    <OykDropdown
                      float
                      toggle={<OykButton icon={Settings} outline />}
                      menu={[
                        {
                          label: t("Edit post"),
                          onClick: () => {},
                          icon: <Pen size={16} />,
                        },
                        {
                          label: t("Delete post"),
                          onClick: () => {},
                          color: "danger",
                          icon: <Trash2 size={16} />,
                        },
                      ]}
                    />
                  ) : null}
                </>
              }
            >
              <p>{oykDate(post.created_at, "full", lang, currentUser?.timezone)}</p>
            </OykHeading>
            <OykCard nop className="oyk-blog-post">
              <OykBanner
                height={256}
                showAvatar={false}
                coverSrc={post.image || currentUniverse.cover}
                coverHeight={256}
              />
              <div className="oyk-blog-post-header">
                <div className="oyk-blog-post-header-content">
                  <p>{post.content}</p>
                </div>
              </div>
            </OykCard>
            <section className="oyk-blog-reactions">
              <OykButton color="card">
                <ThumbsUp size={16} color="var(--oyk-card-fg)" />
                {post.likes !== "0" ? post.likes : null}
              </OykButton>
              <OykButton color="card">
                <ThumbsDown size={16} color="var(--oyk-card-fg)" />
                {post.dislikes !== "0" ? post.dislikes : null}
              </OykButton>
            </section>
            <OykBlogComments />
          </section>
        ) : (
          <OykFeedback title={t("No post found")} icon={Frown} ghost />
        )}
      </OykGrid>
    </section>
  );
}
