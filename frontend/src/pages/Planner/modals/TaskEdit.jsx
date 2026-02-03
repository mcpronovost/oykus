import { useEffect, useState } from "react";
import { Ellipsis, History, Trash2, X } from "lucide-react";

import { api } from "@/services/api";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { oykDate } from "@/utils/formatters";
import {
  OykAvatar,
  OykButton,
  OykDropdown,
  OykForm,
  OykFormField,
  OykFormMessage,
  OykModal,
} from "@/components/ui";

export default function ModalTaskEdit({ isOpen, onClose, task, statusName }) {
  const { currentUser } = useStore();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [isShowHistory, setIsShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    content: task.content,
    priority: task.priority.toString(),
    tags: task.tags,
    assignees: task.assignees,
    dueAt: task.due_at ? task.due_at.substring(0, 10) : "",
  });

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setHasError(null);
    try {
      const r = await api.post(`/planner/tasks/${task.id}/edit/`, formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      onClose(true);
    } catch (e) {
      setHasError(e.message || t("An error occurred while editing the task"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onClickShowHistory = () => {
    setIsShowHistory(!isShowHistory);
  };

  useEffect(() => {
    setIsLoading(false);
    setHasError(null);
    setIsShowHistory(false);
    setFormData({
      title: task.title,
      content: task.content,
      priority: task.priority.toString(),
      tags: task.tags,
      assignees: task.assignees,
      dueAt: task.due_at ? task.due_at.substring(0, 10) : "",
    });
  }, [isOpen]);

  return (
    <OykModal
      title={task.title}
      isOpen={isOpen}
      onClose={onClose}
      actions={
        <>
          <OykDropdown
            float
            toggle={<OykButton icon={Ellipsis} plain />}
            menu={[
              {
                label: isShowHistory ? t("Hide history") : t("Show history"),
                icon: <History size={16} />,
                onClick: () => onClickShowHistory(),
              },
              ...(task.author?.slug === currentUser.slug ? [
                    {
                      label: t("Delete"),
                      icon: <Trash2 size={16} />,
                      color: "danger",
                      onClick: () => onClose(false, true),
                    },
                  ]
                : []),
            ]}
          />
          <OykButton icon={X} onClick={onClose} plain />
        </>
      }
    >
      <OykForm onSubmit={handleSubmit} isLoading={isLoading}>
        <OykFormField
          label={t("Title")}
          name="title"
          defaultValue={formData.title}
          onChange={handleChange}
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
            { label: t("PriorityLow"), value: "1" },
            { label: t("PriorityMedium"), value: "2" },
            { label: t("PriorityHigh"), value: "3" },
          ]}
          defaultValue={formData.priority}
          onChange={handleChange}
        />
        <OykFormField
          label={t("Due At")}
          name="dueAt"
          type="date"
          defaultValue={formData.dueAt}
          onChange={handleChange}
        />
        <OykFormMessage hasError={hasError} />
        <div className="oyk-form-actions">
          <OykButton type="submit" color="primary">
            {t("Save")}
          </OykButton>
          <OykButton type="button" onClick={onClose} outline>
            {t("Cancel")}
          </OykButton>
        </div>
      </OykForm>
      {isShowHistory && (
        <section className="oyk-modal-section">
          <header className="oyk-modal-section-header">
            <h3 className="oyk-modal-section-header-title">{t("History")}</h3>
            <OykButton icon={X} onClick={onClickShowHistory} plain />
          </header>
          <div className="oyk-modal-section-content">
            <ul className="oyk-planner-history">
              {task.history?.map((history) => (
                <li key={history.id}>
                  <div className="oyk-planner-history-avatar">
                    <OykAvatar
                      name={history.changedBy.name}
                      abbr={history.changedBy.abbr}
                      size={32}
                    />
                  </div>
                  <div className="oyk-planner-history-content">
                    <p>
                      {history.changedBy.name} {t("taskHistoryAsChanged")}{" "}
                      "{t(`taskHistory${history.changeType}`)}"{" "}
                      {t("taskHistoryFrom")} "
                      {history.changeType === "PRIORITY"
                        ? t(`Priority${history.oldValue}`)
                        : history.oldValue}
                      " {t("taskHistoryTo")} "
                      {history.changeType === "PRIORITY"
                        ? t(`Priority${history.newValue}`)
                        : history.newValue}
                      "<br />
                      {oykDate(history.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </OykModal>
  );
}