import { useEffect, useState } from "react";
import { Plus, EllipsisVertical, Edit, Trash2 } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useTranslation } from "@/services/translation";
import { OykDropdown, OykModal } from "@/components/ui";

import ModalTaskCreate from "./modals/TaskCreate";
import ModalStatusEdit from "./modals/StatusEdit";

export default function TaskStatusHeader({
  status,
  statuses = [],
  onTasksUpdate = () => {},
}) {
  const { isDev } = useAuth();
  const { currentWorld } = useStore();
  const { t } = useTranslation();

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const handleCreateClick = () => {
    setIsModalCreateOpen(true);
  };

  const handleCloseModalCreate = (updated) => {
    setIsModalCreateOpen(false);
    if (updated) {
      onTasksUpdate();
    }
  };

  const handleEditClick = () => {
    setIsModalEditOpen(true);
  };

  const handleCloseModalEdit = (updated) => {
    setIsModalEditOpen(false);
    if (updated) {
      onTasksUpdate();
    }
  };

  const handleDeleteClick = () => {
    setIsModalDeleteOpen(true);
  };

  const handleCloseModalDelete = (updated) => {
    setIsModalDeleteOpen(false);
    if (updated) {
      onTasksUpdate();
    }
  };

  return (
    <>
      <ModalTaskCreate
        isOpen={isModalCreateOpen}
        onClose={handleCloseModalCreate}
        status={status}
        statuses={statuses}
      />
      <ModalStatusEdit
        isOpen={isModalEditOpen}
        onClose={handleCloseModalEdit}
        status={status}
      />
      <OykModal
        isOpen={isModalDeleteOpen}
        onClose={handleCloseModalDelete}
        status={status}
      >
        <p>Delete</p>
      </OykModal>
      <header className="oyk-planner-status-item-header">
        <div className="oyk-planner-status-item-header-icon">
          <span
            className="oyk-planner-status-item-header-icon-dot"
            style={{
              backgroundColor: status.color || "var(--oyk-c-primary)",
            }}
          />
        </div>
        <h2 className="oyk-planner-status-item-header-title">
          {status.title}{" "}
          <span className="oyk-planner-status-item-header-title-count">
            ({status.tasks?.length || 0})
          </span>
        </h2>
        <div className="oyk-planner-status-item-header-actions">
          <button
            className="oyk-planner-status-item-header-actions-btn"
            onClick={handleCreateClick}
          >
            <Plus size={16} />
          </button>
          {isDev ? (
            <OykDropdown
              toggle={
                <button className="oyk-planner-status-item-header-actions-btn">
                  <EllipsisVertical size={16} />
                </button>
              }
              menu={[
                ...(true
                  ? [
                      {
                        label: t("Edit"),
                        icon: <Edit size={16} />,
                        onClick: handleEditClick,
                      },
                      {
                        label: t("Delete"),
                        icon: <Trash2 size={16} />,
                        onClick: handleDeleteClick,
                      },
                    ]
                  : []),
              ]}
            />) : null}
        </div>
      </header>
    </>
  );
}