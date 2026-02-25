import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useWorld } from "@/services/world";

import { OykAlert, OykButton } from "@/components/ui";

export default function OykBlogPostReactions({
  postId,
  likes = 0,
  dislikes = 0,
  reaction = null,
  handleReactions = () => {},
}) {
  const { isAuth } = useAuth();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const postReaction = async (action) => {
    if (!action) return;

    setIsLoading(action);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("target", "post");
      formData.append("action", action);
      const r = await api.post(`/blog/u/${currentUniverse.slug}/posts/${postId}/reaction/`, formData);
      if (!r.ok || !r.reactions) throw Error();
      handleReactions(r.reactions);
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  if (
    !isAuth ||
    !currentUniverse ||
    !currentUniverse.modules?.blog?.active ||
    !currentUniverse.modules.blog.settings?.is_reactions_enabled
  ) {
    return null;
  }

  return (
    <section className="oyk-blog-reactions">
      {hasError ? <OykAlert variant="danger" small message={hasError} /> : null}
      <OykButton
        color="card"
        isLoading={isLoading === "like"}
        disabled={isLoading}
        onClick={() => postReaction("like")}
      >
        <ThumbsUp size={16} color={reaction === "like" ? "var(--oyk-c-success)" : "var(--oyk-card-fg)"} />
        {likes > 0 ? likes : null}
      </OykButton>
      <OykButton
        color="card"
        isLoading={isLoading === "dislike"}
        disabled={isLoading}
        onClick={() => postReaction("dislike")}
      >
        <ThumbsDown size={16} color={reaction === "dislike" ? "var(--oyk-c-danger)" : "var(--oyk-card-fg)"} />
        {dislikes > 0 ? dislikes : null}
      </OykButton>
    </section>
  );
}
