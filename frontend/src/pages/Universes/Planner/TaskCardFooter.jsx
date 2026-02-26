import { MessagesSquare, History } from "lucide-react";

import { OykAvatar } from "@/components/ui";

export default function TaskCardFooter({ task }) {
  if (
    (!task.history || task.history.length <= 0) &&
    (!task.comments || task.comments.length <= 0) &&
    (!task.assignees || task.assignees.length <= 0)
  )
    return;

  return (
    <footer className="oyk-planner-card-footer">
      <div className="oyk-planner-card-footer-infos">
        {task.history?.length > 0 && (
          <div className="oyk-planner-card-footer-infos-count">
            <History size={14} />
            <span className="oyk-planner-card-footer-infos-count-total">{task.history.length}</span>
          </div>
        )}
        {task.comments?.length > 0 && (
          <div className="oyk-planner-card-footer-infos-count">
            <MessagesSquare size={14} />
            <span className="oyk-planner-card-footer-infos-count-total">{task.comments.length}</span>
          </div>
        )}
        {task.assignees?.length > 0 && (
          <div className="oyk-planner-card-footer-infos-assignees">
            <ul>
              {task.assignees?.map((assignee, index) => (
                <li key={index}>
                  <OykAvatar
                    name={assignee.name}
                    abbr={assignee.abbr}
                    src={assignee.avatar}
                    size={32}
                    borderColor="var(--oyk-card-item-bg)"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
