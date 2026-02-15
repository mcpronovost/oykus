import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import {
  OykAvatar,
  OykButton,
  OykCard,
  OykFeedback,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykHeading,
  OykLoading,
} from "@/components/ui";
import OykBlogPostCommentsCard from "./CommentsCard";

export default function OykBlogPostComments({ postId, postAuthorId }) {
  const { isAuth, currentUser, currentUniverse } = useAuth();
  const { n } = useRouter();
  const { t } = useTranslation();

  const formRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [comments, setComments] = useState([]);
  const [moreComments, setMoreComments] = useState(null);
  const [addCommentForm, setAddCommentForm] = useState({
    content: "",
  });

  const getBlogComments = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.get(
        `/blog/u/${currentUniverse.slug}/posts/${postId}/comments/`,
        signal ? { signal } : {},
      );
      if (!r.ok || !r.comments) throw Error(r.error || t("An error occurred"));
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

  const postBlogComment = async () => {
    setIsSubmitLoading(false);
    setHasError(null);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(addCommentForm)) {
        formData.append(key, value);
      };
      const r = await api.post(`/blog/u/${currentUniverse.slug}/posts/${postId}/comments/create/`, formData);
      if (!r.ok || !r.comments) throw Error();
      setComments(r.comments);
      setAddCommentForm(() => ({
        content: "",
      }));
      formRef.current?.reset();
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddCommentForm((prev) => ({
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

  useEffect(() => {
    if (
      !isAuth ||
      !currentUniverse ||
      !currentUniverse.modules?.blog?.active ||
      !currentUniverse.modules.blog.settings?.is_comments_enabled
    ) {
      return;
    }
    const controller = new AbortController();

    getBlogComments(controller.signal);

    return () => {
      controller.abort();
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
      <OykHeading title={t("Comments")} tag={"h2"} subtitle nop />
      <OykCard>
        {hasError ? (
          <OykFeedback ghost title={t("An error occurred")} message={t(hasError.message)} variant="danger" />
        ) : isLoading ? (
          <OykLoading />
        ) : (
          <>
            <OykForm ref={formRef} onSubmit={postBlogComment} isLoading={isSubmitLoading}>
              <div className="oyk-form-oneline">
                <OykAvatar src={currentUser.avatar} size={40} />
                <OykFormField
                  label={t("Comment")}
                  name="content"
                  placeholder={t("Add a comment")}
                  type="textarea"
                  onChange={handleChange}
                  hasError={hasError?.content}
                  autosize
                  hideLabel
                  required
                />
                {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
                <div className="oyk-form-actions" style={{ alignSelf: "flex-end" }}>
                  <OykButton
                    icon={SendHorizontal}
                    type="submit"
                    color="primary"
                    disabled={isLoading || isSubmitLoading}
                    isLoading={isSubmitLoading}
                  />
                </div>
              </div>
            </OykForm>
            <hr />
            {comments.length > 0 ? (
              <section className="oyk-blog-comments-list">
                {comments.map((comment) => (
                  <OykBlogPostCommentsCard key={comment.id} comment={comment} isByAuthor={comment.author.id === postAuthorId}/>
                ))}
                {moreComments ? (
                  <footer className="oyk-blog-comments-list-footer">
                    <OykButton small outline onClick={() => {}}>
                      {t("Load more")}
                    </OykButton>
                  </footer>
                ) : null}
              </section>
            ) : (
              <OykFeedback title={t("Be the first to comment")} variant="primary" showIcon={false} ghost />
            )}
          </>
        )}
      </OykCard>
    </section>
  );
}
