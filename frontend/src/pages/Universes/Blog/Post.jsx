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
import OykBlogPostReactions from "./Reactions";

export default function OykBlogPost() {
  const { isAuth, currentUser, currentUniverse } = useAuth();
  const { routeTitle, params } = useRouter();
  const { t, lang } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [post, setPost] = useState(null);
  const [reactions, setReactions] = useState({
    likes: 0,
    dislikes: 0,
    user: null,
  });
  const [comments, setComments] = useState([]);

  const getBlogPost = async (signal) => {
    if (!params?.postId) return;

    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/blog/u/${currentUniverse.slug}/posts/${params.postId}`, signal ? { signal } : {});
      if (!r.ok || !r.post) throw Error();
      setPost(r.post);
      setReactions(r.reactions);
      setComments(r.comments);
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
              <time dateTime={post.created_at}>{oykDate(post.created_at, "full", lang, currentUser?.timezone)}</time>
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
            <OykBlogPostReactions
              postId={post.id}
              likes={reactions.likes}
              dislikes={reactions.dislikes}
              reaction={reactions.user}
              handleReactions={setReactions}
            />
            <OykBlogComments postId={post.id} postAuthorId={post.author} />
          </section>
        ) : (
          <OykFeedback title={t("No post found")} icon={Frown} ghost />
        )}
      </OykGrid>
    </section>
  );
}
