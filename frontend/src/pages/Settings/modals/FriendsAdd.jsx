import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { OykButton, OykForm, OykFormField, OykFormMessage, OykModal } from "@/components/ui";

export default function ModalFriendsAdd({ isOpen, onClose }) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [formFriendsAdd, setFormFriendsAdd] = useState({
    name: "",
  });

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("name", formFriendsAdd.name);
      const r = await api.post("/auth/friends/add/", formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      if (e.message == "23000") {
        setHasError(() => ({
          message: t("You have already sent a friend request"),
        }));
      } else {
        setHasError(() => ({
          message: e.message || t("An error occurred"),
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormFriendsAdd({ ...formFriendsAdd, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setFormFriendsAdd({
      name: "",
    });
  }, [isOpen]);

  return (
    <OykModal title={t("Add a Friend")} isOpen={isOpen} onClose={onClose}>
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField label={t("Name")} name="name" defaultValue={formFriendsAdd.name} onChange={handleChange} required />
        {hasError?.message && <OykFormMessage hasError={hasError?.message} />}
        <div className="oyk-form-actions">
          <OykButton type="submit" color="primary">
            {t("Send")}
          </OykButton>
          <OykButton outline action={onClose}>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
    </OykModal>
  );
}
