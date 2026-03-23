import { useState } from "react";
import { Key, X } from "lucide-react";

import { useTranslation } from "@/services/translation";

import { OykButton, OykCard, OykChip } from "@/components/ui";
import OykModalTitleEdit from "./modals/TitleEdit";
import OykModalTitleDelete from "./modals/TitleDelete";

export default function OykUniverseAdminModuleProgressTitlesCard({ title, onCloseModal = () => {} }) {
  const { t } = useTranslation();

  const [isModalTitleEditOpen, setIsModalTitleEditOpen] = useState(false);
  const [isModalTitleDeleteOpen, setIsModalTitleDeleteOpen] = useState(false);

  const handleCloseModalTitle = (updated) => {
    setIsModalTitleEditOpen(false);
    setIsModalTitleDeleteOpen(false);
    if (updated) {
      onCloseModal(true);
    }
  };

  return (
    <>
      <OykModalTitleEdit isOpen={isModalTitleEditOpen} onClose={handleCloseModalTitle} title={title} />
      <OykModalTitleDelete isOpen={isModalTitleDeleteOpen} onClose={handleCloseModalTitle} titleId={title.id} />
      <li className="oyk-universes-admin-module-progress-titles-list-item">
        <OykCard>
          <header className="oyk-universes-admin-module-progress-titles-list-item-info">
            <h3>{title.name}</h3>
            <p>{title.description}</p>
            <small>
              {title.is_unique ? (
                <OykChip outline color="primary">
                  {t("Unique")}
                </OykChip>
              ) : null}
              {title.is_hidden ? <OykChip outline>{t("Hidden")}</OykChip> : null}
              <Key size={14} /> {title.how_to_obtain}
            </small>
          </header>
          <div className="oyk-universes-admin-module-progress-titles-list-item-actions">
            <OykButton outline onClick={() => setIsModalTitleEditOpen(true)}>
              {t("Edit")}
            </OykButton>
            <OykButton outline color="danger" icon={X} onClick={() => setIsModalTitleDeleteOpen(true)} />
          </div>
        </OykCard>
      </li>
    </>
  );
}
