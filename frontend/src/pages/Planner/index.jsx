import "@/assets/styles/page/_planner.scss";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Frown, Plus, Settings } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import { OykButton, OykCard, OykDropdown, OykFeedback, OykGrid, OykHeading, OykLoading } from "@/components/ui";

import ModalStatusCreate from "./modals/StatusCreate";
import ModalTaskCreate from "./modals/TaskCreate";
import TaskStatus from "./TaskStatus";
import TaskCard from "./TaskCard";

export default function Planner() {
  const { isAuth, isDev } = useAuth();
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalStatusCreateOpen, setIsModalStatusCreateOpen] = useState(false);
  const [isModalTaskCreateOpen, setIsModalTaskCreateOpen] = useState(false);

  const getTasks = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      const url =
        !currentUniverse || currentUniverse.is_default
          ? "/planner/tasks/"
          : `/planner/u/${currentUniverse.slug}/tasks/`;
      const r = await api.get(url, signal ? { signal } : {});
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      setTasks(r.tasks);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(e.message || t("An error occurred"));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatusId) => {
    try {
      const url =
        !currentUniverse || currentUniverse.is_default
          ? `/planner/tasks/${taskId}/edit/`
          : `/planner/u/${currentUniverse.slug}/tasks/${taskId}/edit/`;
      const formData = new FormData();
      formData.append("status", newStatusId);
      const r = await api.post(url, formData);
      if (!r.ok) throw new Error(r.error || t("An error occurred"));
      await getTasks();
    } catch (e) {
      setHasError(e.message || t("An error occurred"));
    }
  };

  const handleDrop = (taskId, newStatusId) => {
    updateTaskStatus(taskId, newStatusId);
  };

  const handleStatusCreateClick = () => {
    setIsModalStatusCreateOpen(true);
  };

  const handleCloseModalStatusCreate = (updated) => {
    setIsModalStatusCreateOpen(false);
    if (updated) {
      getTasks();
    }
  };

  const handleTaskCreateClick = () => {
    setIsModalTaskCreateOpen(true);
  };

  const handleCloseModalTaskCreate = (updated) => {
    setIsModalTaskCreateOpen(false);
    if (updated) {
      getTasks();
    }
  };

  useEffect(() => {
    if (!isAuth || (currentUniverse && !currentUniverse.modules?.planner?.active)) return;
    const controller = new AbortController();

    routeTitle(currentUniverse.modules.planner.settings.display_name || t("Planner"));

    getTasks(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  if (!isAuth || (currentUniverse && !currentUniverse.modules?.planner?.active)) {
    return <AppNotAuthorized />;
  }

  return (
    <section className="oyk-page oyk-planner">
      <ModalStatusCreate isOpen={isModalStatusCreateOpen} onClose={handleCloseModalStatusCreate} />
      <ModalTaskCreate isOpen={isModalTaskCreateOpen} onClose={handleCloseModalTaskCreate} statuses={tasks} />
      <OykHeading
        title={currentUniverse.modules.planner.settings.display_name || t("Planner")}
        // description={t("Tasks description")}
        actions={
          <>
            {tasks.length > 0 && (
              <OykButton color="primary" icon={Plus} onClick={handleTaskCreateClick}>
                {t("Create a new task")}
              </OykButton>
            )}
            {isDev ? (
              <OykDropdown
                float
                toggle={<OykButton icon={Settings} outline />}
                menu={[{ label: t("New Status"), onClick: handleStatusCreateClick }]}
              />
            ) : null}
          </>
        }
      />
      {tasks.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <OykGrid className="oyk-planner-status">
            {tasks.map((status) => (
              <OykCard key={status.title} className="oyk-planner-status-item" nop>
                <TaskStatus status={status} statuses={tasks} onDrop={handleDrop} onTasksUpdate={getTasks}>
                  <section
                    className={`oyk-planner-status-item-content ${
                      status.is_completed ? "oyk-planner-status-item-content-completed" : ""
                    }`}
                  >
                    {status.tasks?.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isCompleted={status.is_completed}
                        statusId={status.id}
                        statusName={status.name}
                        onCloseRefresh={getTasks}
                      />
                    ))}
                  </section>
                </TaskStatus>
              </OykCard>
            ))}
          </OykGrid>
        </DndProvider>
      ) : isLoading ? (
        <OykLoading />
      ) : !hasError ? (
        <OykGrid className="oyk-planner-empty">
          <OykFeedback
            title={t("No tasks found")}
            message={t("Start by creating a new status before adding tasks")}
            icon={Frown}
            ghost
          >
            <OykButton color="primary" onClick={handleStatusCreateClick}>
              {t("Create a new status")}
            </OykButton>
          </OykFeedback>
        </OykGrid>
      ) : (
        <OykGrid>
          <OykFeedback
            title={hasError || t("An error occurred")}
            message={t("Please try again later")}
            variant="danger"
            ghost
          />
        </OykGrid>
      )}
    </section>
  );
}
