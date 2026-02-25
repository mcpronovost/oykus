import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { oykTimeAgo } from "@/utils";
import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykAvatar, OykButton, OykChip, OykForm, OykFormField, OykFormMessage } from "@/components/ui";
import OykBlogCommentsActions from "./CommentsActions";

export default function OykBlogPostCommentsCard({
  postId,
  comment,
  postAuthorId,
  isLastReply = false,
  handleReply = () => {},
}) {
  const { currentUser } = useAuth();
  const { t, lang } = useTranslation();
  const { currentUniverse } = useWorld();

  const formRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [reactions, setReactions] = useState({
    likes: comment?.reactions?.likes || 0,
    dislikes: comment?.reactions?.dislikes || 0,
    user: comment?.reactions?.user,
  });
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyCommentForm, setReplyCommentForm] = useState({
    replied_id: comment.replied_id || comment.id,
    content: "",
  });

  const postBlogCommentReply = async () => {
    setIsSubmitLoading(false);
    setHasError(null);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(replyCommentForm)) {
        formData.append(key, value);
      }
      const r = await api.post(`/blog/u/${currentUniverse.slug}/posts/${postId}/comments/create/`, formData);
      if (!r.ok || !r.comments) throw Error();
      handleReply(r.comments);
      toggleReplyForm();
      formRef.current?.reset();
    } catch (e) {
      setHasError({
        message: e.message || t("An error occurred"),
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReplyCommentForm((prev) => ({
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

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  return (
    <article className={`oyk-blog-comments-card ${comment.replies?.length > 0 ? "oyk-replied" : ""}`}>
      <div className="oyk-blog-comments-card-wrapper">
        <OykAvatar src={comment.author.avatar} size={32} name={comment.author.name} abbr={comment.author.abbr} />
        <div>
          <header className="oyk-blog-comments-card-header">
            <div className="oyk-blog-comments-card-header-info">
              <h3 className="oyk-blog-comments-card-header-info-name">{comment.author.name}</h3>
              {comment.author.id == postAuthorId ? <OykChip color="primary">{t("Author")}</OykChip> : null}
              <time className="oyk-blog-comments-card-header-info-date" dateTime={comment.created_at}>
                {oykTimeAgo(comment.created_at, lang, currentUser?.timezone)}
              </time>
              {comment.updated_at != comment.created_at ? (
                <span className="oyk-blog-comments-card-header-info-date">
                  {t("Edited")}{" "}
                  <time dateTime={comment.updated_at}>
                    {oykTimeAgo(comment.updated_at, lang, currentUser?.timezone)}
                  </time>
                </span>
              ) : null}
            </div>
          </header>
          <div className="oyk-blog-comments-card-content">
            <p>{comment.content}</p>
          </div>
          <footer className="oyk-blog-comments-card-footer">
            <OykBlogCommentsActions
              postId={postId}
              commentId={comment.id}
              likes={reactions.likes}
              dislikes={reactions.dislikes}
              reaction={reactions.user}
              showReply={isLastReply}
              handleReactions={setReactions}
              handleReply={toggleReplyForm}
            />
          </footer>
        </div>
      </div>
      {currentUniverse.modules.blog.settings.is_comments_replies_enabled && showReplyForm && isLastReply ? (
        <section className="oyk-blog-comments-card-reply">
          <OykForm ref={formRef} onSubmit={postBlogCommentReply} isLoading={isSubmitLoading}>
            <div className="oyk-form-oneline">
              <OykAvatar src={currentUser.avatar} size={32} />
              <OykFormField
                label={t("Comment")}
                name="content"
                placeholder={t("Write a reply")}
                type="textarea"
                onChange={handleChange}
                hasError={hasError?.content}
                autosize
                hideLabel
                required
              />
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
          {hasError?.message && <OykFormMessage hasError={hasError?.message} small />}
        </section>
      ) : null}
      {comment.replies?.length > 0 ? (
        <section className="oyk-blog-comments-card-replies">
          {comment.replies.map((reply, index) => (
            <OykBlogPostCommentsCard
              key={`${comment.id}-${reply.id}`}
              postId={postId}
              comment={reply}
              postAuthorId={postAuthorId}
              isLastReply={index + 1 === comment.replies.length}
              handleReply={handleReply}
            />
          ))}
        </section>
      ) : null}
    </article>
  );
}
