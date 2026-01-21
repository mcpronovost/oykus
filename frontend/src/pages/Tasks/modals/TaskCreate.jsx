import { useState, useEffect } from "react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykFeedback,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykModal,
} from "@/components/ui";

export default function ModalTaskCreate({
  isOpen,
  onClose,
  status,
  statuses,
}) {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.post("/tasks/create/", formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (statuses.length > 0 && !formData.statusId) {
      setFormData((prev) => ({
        ...prev,
        statusId: status?.id || statuses[0]?.id || "",
      }));
    }
  }, [statuses, status?.id, formData.statusId]);

  useEffect(() => {
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      statusId: status?.id || statuses[0]?.value || "",
      assignees: [],
      tags: [],
    });
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new task")} isOpen={isOpen} onClose={onClose}>
      {statuses.length > 0 ? (
        <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
          <OykFormField
            label={t("Title")}
            name="title"
            defaultValue={formData.title}
            onChange={handleChange}
            required
          />
          <OykFormField
            label={t("Content")}
            name="content"
            type="textarea"
            defaultValue={formData.content}
            onChange={handleChange}
          />
          <OykFormField
            label={t("Priority")}
            name="priority"
            type="radio"
            options={[
              { label: t("PriorityLow"), value: "low" },
              { label: t("PriorityMedium"), value: "medium" },
              { label: t("PriorityHigh"), value: "high" },
            ]}
            defaultValue={formData.priority}
            onChange={handleChange}
          />
          <OykFormField
            label={t("Status")}
            name="statusId"
            type="select"
            options={statuses}
            optionLabel="title"
            optionValue="id"
            defaultValue={formData.statusId}
            onChange={handleChange}
            required
          />
          <OykFormMessage hasError={hasError} />
          <div className="oyk-form-actions">
            <OykButton type="submit" color="primary">
              {t("Save")}
            </OykButton>
            <OykButton outline action={onClose}>
              {t("Cancel")}
            </OykButton>
          </div>
        </OykForm>
      ) : (
        <OykFeedback
          title={t("No statuses available")}
          message={t("Please create a status first")}
          variant="danger"
        >
          <OykButton
            outline
            action={() => {
              onClose();
            }}
          >
            {t("Close")}
          </OykButton>
        </OykFeedback>
      )}
    </OykModal>
  );
}