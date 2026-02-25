import { useState } from "react";
import { Ellipsis, ThumbsUp, ThumbsDown } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykAlert, OykButton, OykDropdown } from "@/components/ui";

export default function OykBlogCommentsActions({
  postId,
  commentId,
  likes = 0,
  dislikes = 0,
  reaction = null,
  showReply = true,
  handleReactions = () => {},
  handleReply = () => {},
}) {
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const postReaction = async (action) => {
    if (!action) return;

    setIsLoading(action);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("target", "comment");
      formData.append("action", action);
      const r = await api.post(
        `/blog/u/${currentUniverse.slug}/posts/${postId}/comments/${commentId}/reaction/`,
        formData,
      );
      if (!r.ok || !r.reactions) throw Error();
      handleReactions(r.reactions);
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="oyk-blog-comments-card-footer-actions">
      {!currentUniverse.modules.blog.settings?.is_comments_reactions_enabled ? null : (
        <>
          <OykButton
            plain
            small
            disabled={isLoading}
            isLoading={isLoading === "like"}
            onClick={() => postReaction("like")}
          >
            <ThumbsUp size={16} color={reaction === "like" ? "var(--oyk-c-success)" : "var(--oyk-card-fg)"} />{" "}
            {likes > 0 ? likes : null}
          </OykButton>
          <OykButton
            plain
            small
            disabled={isLoading}
            isLoading={isLoading === "dislike"}
            onClick={() => postReaction("dislike")}
          >
            <ThumbsDown size={16} color={reaction === "dislike" ? "var(--oyk-c-danger)" : "var(--oyk-card-fg)"} />{" "}
            {dislikes > 0 ? dislikes : null}
          </OykButton>
        </>
      )}
      {!showReply || !currentUniverse.modules.blog.settings?.is_comments_replies_enabled ? null : (
        <OykButton plain small disabled={isLoading} onClick={() => handleReply()}>
          {t("Reply")}
        </OykButton>
      )}
      {/*<OykDropdown
        toggle={<OykButton icon={Ellipsis} plain small />}
        menu={[{ label: t("Reply") }]}
        direction="right"
      />*/}
      {hasError ? <OykAlert message={hasError} variant="danger" small /> : null}
    </div>
  );
}
