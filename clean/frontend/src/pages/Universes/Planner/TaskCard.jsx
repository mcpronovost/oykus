import { useState } from "react";
import { useDrag } from "react-dnd";

import { oykCode } from "@/utils/formatters";
import { OykChip } from "@/components/ui";

import OykTaskCardHeader from "./TaskCardHeader";
import OykTaskCardFooter from "./TaskCardFooter";
import ModalTaskEdit from "./modals/TaskEdit";
import ModalTaskDelete from "./modals/TaskDelete";

export default function TaskCard({ task, isCompleted, status, onCloseRefresh = () => {} }) {
  const [isModalTaskEditOpen, setIsModalTaskEditOpen] = useState(false);
  const [isModalTaskDeleteOpen, setIsModalTaskDeleteOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, statusId: status.id, statusName: status.title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const handleEditTaskClose = (doRefresh = false, showDelete = false) => {
    setIsModalTaskEditOpen(false);
    if (showDelete) {
      setIsModalTaskDeleteOpen(true);
    } else if (doRefresh && onCloseRefresh) {
      onCloseRefresh();
    }
  };

  const handleDeleteTaskClose = (doRefresh = false) => {
    setIsModalTaskDeleteOpen(false);
    if (doRefresh && onCloseRefresh) {
      onCloseRefresh();
    }
  };

  return (
    <>
      <ModalTaskEdit isOpen={isModalTaskEditOpen} onClose={handleEditTaskClose} task={task} status={status} />
      <ModalTaskDelete isOpen={isModalTaskDeleteOpen} onClose={handleDeleteTaskClose} task={task} />
      <article
        ref={drag}
        key={task.id}
        onClick={() => setIsModalTaskEditOpen(true)}
        className={`oyk-planner-card ${
          isDragging ? "oyk-planner-card-dragging" : ""
        }`}
        style={{ opacity: isDragging ? 0.5 : isCompleted ? 0.7 : 1 }}
      >
        <OykTaskCardHeader task={task} isCompleted={isCompleted} />
        {!isCompleted && ((task.content && task.content != task.title) || task.tags?.length > 0) && (
          <section className="oyk-planner-card-content">
            {task.content && task.content != task.title && (
              <div className="oyk-planner-card-content-description oyk-code oyk-xs">
                <div dangerouslySetInnerHTML={{__html: oykCode(task.content)}}></div>
              </div>
            )}
            {task.tags?.length > 0 && (
              <div className="oyk-planner-card-content-tags">
                {task.tags.map((tag) => (
                  <OykChip key={tag.id} color={tag.color || undefined}>
                    {tag.name}
                  </OykChip>
                ))}
              </div>
            )}
          </section>
        )}
        {!isCompleted && (<OykTaskCardFooter task={task} />)}
      </article>
    </>
  );
}