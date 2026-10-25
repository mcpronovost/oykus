import { useEffect, useState } from "react";
import { IconDotsVertical, IconMessages, IconSquareFilled } from "@tabler/icons-react";
import { OykButton, OykCard, OykChip, OykDivider, OykProgressBar } from "@/components/ui";

const TEST_DATA = [
  {
    id: 1,
    title: "Task 1",
    description:
      "Design unique concept ideas through sketching and brainstorming sessions",
    status: "To Do",
    dueDate: "2026-01-01",
    assignees: ["John Doe", "Jane Doe"],
    tags: [
      "Tag 1",
      "Tag 2",
      "Tag 3",
      "Tag 4",
      "Tag 5",
      "Tag 6",
      "Tag 7",
      "Tag 8",
      "Tag 9",
      "Tag 10",
    ],
  },
  {
    id: 2,
    title: "Task 2",
    description: "",
    status: "In Progress",
    dueDate: "2026-10-23",
    assignees: ["John Doe", "Jane Doe"],
    tags: ["Tag 1", "Tag 2"],
  },
  {
    id: 3,
    title: "Zmiana zupa wysoki",
    description:
      "Lotnisko niebo dzisiaj, nowy zmęczony ono podróżować, między chodzić gotować gorący. Zmiana zupa wysoki — nic talerz sprzedawać biuro, nigdy zdjęcie, przyjazny pogoda.",
    status: "Done",
    assignees: ["John Doe", "Jane Doe"],
    tags: [],
  },
  {
    id: 4,
    title: "Task 4",
    description:
      "Refine the 3D model to ensure it is visually appealing and meets the brand's visual style.",
    status: "To Do",
    assignees: ["John Doe", "Jane Doe"],
    tags: [
      "Tag 1",
      "Tag 2",
      "Tag 3",
      "Tag 4",
      "Tag 5",
      "Tag 6",
      "Tag 7",
      "Tag 8",
      "Tag 9",
      "Tag 10",
    ],
  },
];

const OykKanban = () => {
  const [tasks, setTasks] = useState(TEST_DATA);
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    const statuses = tasks.map((task) => task.status);
    setStatuses(Array.from(new Set(statuses)));
  }, [tasks]);

  return (
    <div className="oyk-kanban">
      {statuses.map((status) => (
        <section key={status} className="oyk-kanban-status">
          <header className="oyk-kanban-status-header">
            <div className="oyk-kanban-status-header-content">
              <IconSquareFilled size={12} />
              <h2 className="oyk-kanban-status-header-content-title">
                {status}
              </h2>
              <div className="oyk-kanban-status-header-content-count">
                ({tasks.filter((task) => task.status === status).length})
              </div>
            </div>
            <div className="oyk-kanban-status-header-actions">
              <OykButton icon={IconDotsVertical} />
            </div>
          </header>
          <ol className="oyk-kanban-status-list">
            {tasks
              .filter((task) => task.status === status)
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
