import { Ellipsis, ThumbsUp, ThumbsDown } from "lucide-react";

import { oykDate, oykTimeAgo } from "@/utils";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykAvatar, OykButton, OykChip, OykDropdown } from "@/components/ui";

export default function OykBlogPostCommentsCard({ comment, isByAuthor }) {
  const { currentUser } = useAuth();
  const { t, lang } = useTranslation();

  return (
    <article className="oyk-blog-comments-card">
      <OykAvatar src={comment.author.avatar} size={32} name={comment.author.name} abbr={comment.author.abbr} />
      <div>
        <header className="oyk-blog-comments-card-header">
          <div className="oyk-blog-comments-card-header-info">
            <h3 className="oyk-blog-comments-card-header-info-name">{comment.author.name}</h3>
            {isByAuthor ? <OykChip color="primary">{t("Author")}</OykChip> : null}
            <time className="oyk-blog-comments-card-header-info-date" dateTime={comment.created_at}>
              {oykTimeAgo(comment.created_at, lang, currentUser?.timezone)}
            </time>
            {comment.updated_at != comment.created_at ? (
              <span className="oyk-blog-comments-card-header-info-date">
                {t("Edited")}{" "}
                <time dateTime={comment.updated_at}>{oykTimeAgo(comment.updated_at, lang, currentUser?.timezone)}</time>
              </span>
            ) : null}
          </div>
        </header>
        <div className="oyk-blog-comments-card-content">
          <p>{comment.content}</p>
        </div>
        <footer className="oyk-blog-comments-card-footer">
          <div className="oyk-blog-comments-card-footer-actions">
            <OykButton plain small>
              <ThumbsUp
                size={16}
                color={comment.reactions.user === "like" ? "var(--oyk-c-success)" : "var(--oyk-card-fg)"}
              />{" "}
              {comment.reactions.likes > 0 ? comment.reactions.likes : null}
            </OykButton>
            <OykButton plain small>
              <ThumbsDown
                size={16}
                color={comment.reactions.user === "dislike" ? "var(--oyk-c-danger)" : "var(--oyk-card-fg)"}
              />{" "}
              {comment.reactions.dislikes > 0 ? comment.reactions.dislikes : null}
            </OykButton>
            <OykDropdown
              toggle={<OykButton icon={Ellipsis} plain small />}
              menu={[{ label: t("Reply") }]}
              direction="right"
            />
          </div>
        </footer>
      </div>
    </article>
  );
}
