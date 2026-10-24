import { useTranslation } from "@/services/translation";
import { OykCard } from "@/components/ui";

export default function OykApp() {
  const { t } = useTranslation();

  return (
    <div className="oyk-core">
      <nav className="oyk-core-nav">
        <span>aaa</span>
        <span>bbb</span>
      </nav>
      <main className="oyk-core-main">
        <header className="oyk-core-main-header">{t("hello")}</header>
        <div className="oyk-tracker">
          <div className="oyk-tracker-kanban">
            <section className="oyk-tracker-kanban-status">
              <header className="oyk-tracker-kanban-status-header">
                <h2 className="oyk-tracker-kanban-status-header-title">To Do</h2>
              </header>
              <ol className="oyk-tracker-kanban-status-list" style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                <li className="oyk-tracker-kanban-status-list-item">
                  <OykCard>
                    task #2
                  </OykCard>
                </li>
                <li className="oyk-tracker-kanban-status-list-item" style={{ width: "300px" }}>
                  <OykCard>
                    <header className="oyk-tracker-kanban-task-header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div>tags...</div>
                        <h3>Task Title</h3>
                      </div>
                      <div>
                        date due
                      </div>
                    </header>
                    <div className="oyk-tracker-kanban-task-content">
                      blablabla...
                    </div>
                    <div>
                      progressbar or divider
                    </div>
                    <footer className="oyk-tracker-kanban-task-footer" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <div>assignees...</div>
                      <div>actions...</div>
                    </footer>
                  </OykCard>
                </li>
                <li className="oyk-tracker-kanban-status-list-item">
                  <OykCard>
                    task #3
                  </OykCard>
                </li>
              </ol>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
