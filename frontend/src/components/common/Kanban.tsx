import { useState } from "react";
import { IconDotsVertical, IconSquareFilled } from "@tabler/icons-react";
import { OykButton, OykCard, OykChip, OykProgressBar } from "@/components/ui";

const TEST_DATA = [
  {
    id: 1,
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        dueDate: "2026-01-01",
        tags: ["tag1", "tag2"],
      },
    ],
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [
      {
        id: 2,
        title: "Task 2",
        description: "",
        dueDate: "2026-01-02",
        tags: [],
      },
    ],
  },
  {
    id: 3,
    title: "Done",
    tasks: [
      {
        id: 3,
        title: "Task 3",
        description: "Description 3",
        dueDate: "2026-01-03",
        tags: ["tag3"],
      },
    ],
  },
];

const OykKanban = () => {
  const [statuses, setStatuses] = useState(TEST_DATA);

  return (
    <div className="oyk-kanban">
      {statuses.map((status) => (
        <section key={status.id} className="oyk-kanban-status">
          <header className="oyk-kanban-status-header">
            <div className="oyk-kanban-status-header-content">
              <IconSquareFilled size={12} />
              <h2 className="oyk-kanban-status-header-content-title">
                {status.title}
              </h2>
              <div className="oyk-kanban-status-header-content-count">
                ({status.tasks.length})
              </div>
            </div>
            <div className="oyk-kanban-status-header-actions">
              <OykButton icon={IconDotsVertical} />
            </div>
          </header>
          <ol className="oyk-kanban-status-list">
            {status.tasks
              .map((task) => (
                <li key={task.id} className="oyk-kanban-status-list-item">
                  <OykCard>
                    <header className="oyk-kanban-task-header">
                      <div>
                        {task.tags.length > 0 && (
                          <div className="oyk-kanban-task-header-tags">
                            {task.tags.map((tag) => (
                              <OykChip key={tag} color="accent" variant="pill">
                                {tag}
                              </OykChip>
                            ))}
                          </div>
                        )}
                        <h3 className="oyk-kanban-task-header-title">{task.title}</h3>
                      </div>
                      <div className="oyk-kanban-task-header-duedate">
                        <time dateTime={task.dueDate}>{task.dueDate}</time>
                      </div>
                    </header>
                    {task.description && (
                      <div className="oyk-kanban-task-content">
                        {task.description}
                      </div>
                    )}
                    {task.id === 1 && (
                      <div className="oyk-kanban-task-separator">
                        <OykProgressBar progress={Math.random() * 100} />
                      </div>
                    )}
                    {/* FUTURE FEATURE: <footer className="oyk-kanban-task-footer">
                      <div></div>
                      <div>
                        <IconMessages size={18} />
                      </div>
                    </footer> */}
                  </OykCard>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
};

export default OykKanban;
