import { useState, useEffect } from "react";

import { api } from "@/services/api";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

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
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [taskForm, setTaskForm] = useState({});

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const url =
        !currentUniverse || currentUniverse.is_default
          ? "/planner/tasks/create/"
          : `/planner/u/${currentUniverse.slug}/tasks/create/`;
      const formData = new FormData();
      for (const [key, value] of Object.entries(taskForm)) {
        formData.append(key, value);
      };
      const r = await api.post(url, formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (statuses.length > 0 && !taskForm.status) {
      setTaskForm((prev) => ({
        ...prev,
        status: status?.id || statuses[0]?.id || "",
      }));
    }
  }, [statuses, status?.id, taskForm.status]);

  useEffect(() => {
    setTaskForm({
      title: "",
      content: "",
      priority: "2",
      status: status?.id || statuses[0]?.value || "",
      assignees: [],
      tags: [],
      universe: currentUniverse?.slug || null,
    });
  }, [isOpen]);

  return (
    <OykModal title={t("Create a new task")} isOpen={isOpen} onClose={onClose}>
      {statuses.length > 0 ? (
        <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
          <OykFormField
            label={t("Title")}
            name="title"
            defaultValue={taskForm.title}
            onChange={handleChange}
            required
          />
          <OykFormField
            label={t("Content")}
            name="content"
            type="textarea"
            defaultValue={taskForm.content}
            onChange={handleChange}
          />
          <OykFormField
            label={t("Priority")}
            name="priority"
            type="radio"
            options={[
              { label: t("PriorityLow"), value: "1" },
              { label: t("PriorityMedium"), value: "2" },
              { label: t("PriorityHigh"), value: "3" },
            ]}
            defaultValue={taskForm.priority}
            onChange={handleChange}
          />
          <OykFormField
            label={t("Status")}
            name="status"
            type="select"
            options={statuses}
            optionLabel="title"
            optionValue="id"
            defaultValue={taskForm.status}
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
      ) : (
        <OykFeedback
          title={t("No statuses available")}
          message={t("Please create a status first")}
          variant="danger"
        >
          <OykButton
            outline
            onClick={() => {
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