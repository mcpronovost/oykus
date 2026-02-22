import { Timer } from "lucide-react";

import { oykDate, oykDateLessThan } from "@/utils";
import { useTranslation } from "@/services/translation";
import { OykChip } from "@/components/ui";

export default function TaskCardHeader({ task, isCompleted }) {
  const { t, lang } = useTranslation();

  return (
    <header className="oyk-planner-card-header">
      <h3
        className={`oyk-planner-card-header-title ${
          isCompleted ? "oyk-planner-card-header-title-completed" : ""
        }`}
      >
        {task.title}
      </h3>
      {!isCompleted && ((task.priority && task.priority !== 2) || task.due_at) && (
        <div className="oyk-planner-card-header-infos">
          {(task.priority && task.priority !== 2) && (
            <div className="oyk-planner-card-header-infos-priority">
              {task.priority === 3 && (
                <OykChip color="danger" outline>
                  {t("PriorityHigh")}
                </OykChip>
              )}
              {/* task.priority === 2 && (
                <OykChip color="primary" outline>
                  {t("PriorityMedium")}
                </OykChip>
              )*/}
              {task.priority === 1 && (
                <OykChip color="success" outline>
                  {t("PriorityLow")}
                </OykChip>
              )}
            </div>
          )}
          {task.due_at && (
            <div
              className="oyk-planner-card-header-infos-due"
              style={{
                color: oykDateLessThan(task.due_at, 7)
                  ? "var(--oyk-c-danger)"
                  : "inherit",
              }}
            >
              <span className="oyk-planner-card-header-infos-due-date">
                {oykDate(task.due_at, "date", lang)}
              </span>
              <Timer
                size={14}
                className="oyk-planner-card-header-infos-due-icon"
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}