import { useEffect, useState } from "react";
import { Frown, Plus, Settings } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { oykDate } from "@/utils";
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
  OykLink,
  OykLoading,
} from "@/components/ui";
import OykModalPostCreate from "./modals/PostCreate";

export default function OykBlog() {
  const { isAuth } = useAuth();
  const { n, routeTitle } = useRouter();
  const { t, lang } = useTranslation();
  const { currentUser, currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isModalPostCreateOpen, setIsModalPostCreateOpen] = useState(false);

  const getBlogPosts = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(`/blog/u/${currentUniverse.slug}/posts/`, signal ? { signal } : {});
      if (!r.ok || !r.posts) throw Error();
      setPosts(r.posts);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(e.message || t("An error occurred"));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handlePostClick = (id) => {
    n("blog-post", { universeSlug: currentUniverse.slug, postId: id });
  };

  const handleCloseModalPostCreate = (updated) => {
    setIsModalPostCreateOpen(false);
    if (updated) {
      getBlogPosts();
    }
  };

  useEffect(() => {
    if (!isAuth || (currentUniverse && !currentUniverse.modules?.blog?.active)) return;
    const controller = new AbortController();

    routeTitle(currentUniverse.modules.blog.settings.display_name || t("Blog"));

    getBlogPosts(controller.signal);

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
      <OykModalPostCreate isOpen={isModalPostCreateOpen} onClose={handleCloseModalPostCreate} />
      <OykHeading
        title={currentUniverse.modules.blog.settings.display_name || t("Blog")}
        actions={
          <>
            {currentUniverse.role === 1 ? (
              <OykButton color="primary" icon={Plus} onClick={() => setIsModalPostCreateOpen(true)}>
                {t("Create a new post")}
              </OykButton>
            ) : null}
            {currentUniverse.role === 1 ? (
              <OykDropdown
                float
                toggle={<OykButton icon={Settings} outline />}
                menu={[
                  {
                    label: t("Edit settings"),
                    onClick: () => {
                      n("universe-admin-modules-blog", { universeSlug: currentUniverse.slug });
                    },
                  },
                ]}
              />
            ) : null}
          </>
        }
      />
      <OykGrid>
        {hasError ? (
          <OykFeedback ghost title={t("An error occurred")} message={t(hasError.message)} variant="danger" />
        ) : isLoading ? (
          <OykLoading />
        ) : posts?.length > 0 ? (
          <section>
            <OykGridRow wrap>
              {posts.map((post, index) => (
                <OykGridCol key={index} col={index <= 0 ? "100" : "25"} md={index <= 0 ? "100" : "50"} sm="100">
                  <OykCard clickable nop fh className="oyk-blog-item" onClick={() => handlePostClick(post.id)}>
                    <OykBanner
                      height={index <= 0 ? 212 : 66}
                      showAvatar={false}
                      coverSrc={post.image || currentUniverse.cover}
                      coverHeight={index <= 0 ? 256 : 100}
                    />
                    <section className="oyk-blog-item-content">
                      <div className="oyk-blog-item-wrapper">
                        <header className="oyk-blog-item-content-header">
                          <div className="oyk-blog-item-content-header-date">
                            {oykDate(post.created_at, "full", lang, currentUser?.timezone)}
                          </div>
                          <h2 className="oyk-blog-item-content-header-title">
                            <OykLink
                              block
                              routeName="blog-post"
                              params={{ universeSlug: currentUniverse.slug, postId: post.id }}
                            >
                              {post.title}
                            </OykLink>
                          </h2>
                        </header>
                        {post.description ? <div className="oyk-blog-item-content-preview">{post.description}</div> : null}
                      </div>
                      <footer className="oyk-blog-item-footer">
                        <div></div>
                        {(currentUniverse.modules.blog.settings?.is_comments_enabled) ? (
                          <div className="oyk-blog-item-footer-comments">{t("{count} comments", post.comments )}</div>
                        ) : null}
                      </footer>
                    </section>
                  </OykCard>
                </OykGridCol>
              ))}
            </OykGridRow>
          </section>
        ) : (
          <OykFeedback title={t("No posts found")} icon={Frown} ghost />
        )}
      </OykGrid>
    </section>
  );
}
