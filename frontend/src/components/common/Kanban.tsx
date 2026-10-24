import { useEffect, useState } from "react";
import OykCard from "@/components/ui/Card";

const TEST_DATA = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    status: "To Do",
    assignees: ["John Doe", "Jane Doe"],
    tags: ["Tag 1", "Tag 2"],
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    status: "In Progress",
    assignees: ["John Doe", "Jane Doe"],
    tags: ["Tag 1", "Tag 2"],
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description 3",
    status: "Done",
    assignees: ["John Doe", "Jane Doe"],
    tags: ["Tag 1", "Tag 2"],
  },
  {
    id: 4,
    title: "Task 4",
    description: "Description 4",
    status: "To Do",
    assignees: ["John Doe", "Jane Doe"],
    tags: ["Tag 1", "Tag 2"],
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
            <h2 className="oyk-kanban-status-header-title">{status}</h2>
          </header>
          <ol className="oyk-kanban-status-list">
            {tasks.filter((task) => task.status === status).map((task) => (
              <li key={task.id} className="oyk-kanban-status-list-item">
                <OykCard>
                  <header className="oyk-kanban-task-header">
                    <div>
                      <div>tags...</div>
                      <h3>{task.title}</h3>
                    </div>
                    <div>
                      date due
                    </div>
                  </header>
                  <div className="oyk-kanban-task-content">
                    blablabla... <span style={{ color: "var(--oyk-card-divider)" }}>span</span>
                  </div>
                  <div>
                    progressbar or divider
                  </div>
                  <footer className="oyk-tracker-kanban-task-footer">
                    <div>assignees...</div>
                    <div>actions...</div>
                  </footer>
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