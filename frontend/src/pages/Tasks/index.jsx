import "@/styles/page/_tasks.scss";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Frown, Plus, Settings } from "lucide-react";

import { api } from "@/services/api";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import AppNotAuthorized from "@/components/core/AppNotAuthorized";
import AppNotFound from "@/components/core/AppNotFound";
import { OykButton, OykFeedback, OykGrid, OykHeading, OykLoading } from "@/components/common";

import ModalStatusCreate from "./modals/ModalStatusCreate";
import ModalTaskCreate from "./modals/ModalTaskCreate";
import TaskStatus from "./TaskStatus";
import TaskCard from "./TaskCard";

function Tasks() {
  const { currentUser, currentWorld } = useStore();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [isModalStatusCreateOpen, setIsModalStatusCreateOpen] = useState(false);
  const [isModalTaskCreateOpen, setIsModalTaskCreateOpen] = useState(false);

  const getTasks = async () => {
    setIsLoading(true);
    setHasError(null);
    try {
      const data = await api.getTasks(currentWorld.id);
      setTasks(data);
      setStatusOptions(data.map((s) => ({
        label: s.name,
        value: s.id,
      })));
    } catch (error) {
      if (error?.status === 401) {
        setHasError(401);
      } else {
        setHasError(t("An error occurred while fetching tasks"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (
    taskId,
    newStatusId,
    oldStatusName,
    newStatusName
  ) => {
    try {
      await api.updateTaskStatus(
        currentWorld.id,
        taskId,
        newStatusId,
        oldStatusName,
        newStatusName
      );
      await getTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDrop = (taskId, newStatusId, oldStatusName, newStatusName) => {
    updateTaskStatus(taskId, newStatusId, oldStatusName, newStatusName);
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
    getTasks();
  }, []);

  if (!currentUser || hasError === 401) {
    return <AppNotAuthorized />;
  }

  if (!currentWorld) {
    return <AppNotFound />;
  }

  return (
    <section className="oyk-page oyk-tasks">
      <ModalStatusCreate
        isOpen={isModalStatusCreateOpen}
        onClose={handleCloseModalStatusCreate}
      />
      <ModalTaskCreate
        isOpen={isModalTaskCreateOpen}
        onClose={handleCloseModalTaskCreate}
        statusOptions={statusOptions}
      />
      <OykHeading
        title={t("Tasks")}
        description={t("Tasks description")}
        actions={
          <>
            {tasks.length > 0 && (<OykButton
              color="primary"
              icon={Plus}
              action={handleTaskCreateClick}
            >
              {t("Create a new task")}
            </OykButton>)}
            <OykButton icon={Settings} outline />
          </>
        }
      />
      {tasks.length > 0 ? (<DndProvider backend={HTML5Backend}>
        <OykGrid className="oyk-tasks-status">
          {tasks.map((status) => (
            <article key={status.name} className="oyk-tasks-status-item">
              <TaskStatus
                status={status}
                statusOptions={statusOptions}
                onDrop={handleDrop}
                onTasksUpdate={getTasks}
              >
                <section
                  className={`oyk-tasks-status-item-content ${
                    status.isCompleted
                      ? "oyk-tasks-status-item-content-completed"
                      : ""
                  }`}
                >
                  {status.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isCompleted={status.isCompleted}
                      statusId={status.id}
                      statusName={status.name}
                      onCloseRefresh={getTasks}
                    />
                  ))}
                </section>
              </TaskStatus>
            </article>
          ))}
        </OykGrid>
      </DndProvider>) : isLoading ? (
        <OykLoading />
      ) : (
        <OykGrid className="oyk-tasks-empty">
          <OykFeedback
            title={t("No tasks found")}
            message={t("Start by creating a new status before adding tasks")}
            icon={Frown}
            ghost
          >
            <OykButton
              color="primary"
              action={handleStatusCreateClick}
            >
              {t("Create a new status")}
            </OykButton>
          </OykFeedback>
        </OykGrid>
      )}
    </section>
  );
}

export default Tasks;
