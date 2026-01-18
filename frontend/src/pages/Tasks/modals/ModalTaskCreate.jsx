import { useState, useEffect } from "react";

import { api } from "@/services/api";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykFeedback,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykModal,
} from "@/components/common";

export default function ModalTaskCreate({
  isOpen,
  onClose,
  status,
  statusOptions,
}) {
  const { currentUser, currentWorld } = useStore();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const data = await api.createTask(currentWorld.id, formData);
      if (!data.id) {
        throw new Error(
          data.message || data.error || t("Failed to create task")
        );
      }
      onClose(true);
    } catch (error) {
      setHasError(
        error.message || error.error || error || t("An error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (statusOptions.length > 0 && !formData.statusId) {
      setFormData((prev) => ({
        ...prev,
        statusId: status?.id || statusOptions[0]?.value || "",
      }));
    }
  }, [statusOptions, status?.id, formData.statusId]);

  useEffect(() => {
    setFormData({
      title: "",
      content: "",
      priority: "",
      authorId: currentUser.id,
      statusId: status?.id || statusOptions[0]?.value || "",
      assignees: [],
      tags: [],
    });
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new task")} isOpen={isOpen} onClose={onClose}>
      {statusOptions.length > 0 ? (
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
              { label: t("PriorityNone"), value: "" },
              { label: t("PriorityLow"), value: "LOW" },
              { label: t("PriorityMedium"), value: "MEDIUM" },
              { label: t("PriorityHigh"), value: "HIGH" },
            ]}
            defaultValue={formData.priority}
            onChange={handleChange}
          />
          <OykFormField
            label={t("Status")}
            name="statusId"
            type="select"
            options={statusOptions}
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