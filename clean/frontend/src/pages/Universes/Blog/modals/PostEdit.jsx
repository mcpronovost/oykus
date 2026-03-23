import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function ModalPostCreate({ post, isOpen, onClose }) {
  const { currentUniverse } = useWorld();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [postForm, setPostForm] = useState({});

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(postForm)) {
        formData.append(key, value);
      }
      const r = await api.post(`/blog/u/${currentUniverse.slug}/posts/${post?.id}/edit/`, formData);
      if (!r.ok || !r.post) throw new Error(r.error || t("An error occurred"));
      onClose(true, r.post);
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setPostForm({
      title: post?.title || "",
      description: post?.description || "",
      content: post?.content || "",
    });
    setIsLoading(false);
    setHasError(null);
  }, [isOpen]);

  return (
    <OykModal title={t("Edit post")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField label={t("Title")} name="title" defaultValue={postForm.title} onChange={handleChange} required />
        <OykFormField
          label={t("Description")}
          name="description"
          defaultValue={postForm.description}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Content")}
          name="content"
          type="textarea"
          defaultValue={postForm.content}
          onChange={handleChange}
          required
        />
        <OykFormMessage hasError={hasError} />
        <div className="oyk-form-actions">
          <OykButton type="submit" color="primary">
            {t("Save")}
          </OykButton>
          <OykButton outline onClick={onClose}>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}
