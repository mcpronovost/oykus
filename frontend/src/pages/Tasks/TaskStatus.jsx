import { useDrop } from "react-dnd";

import TaskStatusHeader from "./TaskStatusHeader";

function TaskStatus({ status, statusOptions = [], onDrop, onTasksUpdate = () => {}, children }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (item.statusId !== status.id) {
        onDrop(item.id, status.id, item.statusName, status.name);
      }
    },
    canDrop: (item) => item.statusId !== status.id,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`oyk-tasks-status-dropzone ${
        isOver && canDrop ? "oyk-tasks-status-dropzone-over" : ""
      }`}
    >
      <TaskStatusHeader status={status} statusOptions={statusOptions} onTasksUpdate={onTasksUpdate} />
      {children}
    </div>
  );
}

export default TaskStatus;