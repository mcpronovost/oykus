import { useState } from "react";
import { Key, X } from "lucide-react";

import { useTranslation } from "@/services/translation";

import { OykButton, OykCard, OykChip } from "@/components/ui";
import OykModalTitleDelete from "./modals/TitleDelete";

export default function OykUniverseAdminModuleRewardTitlesCard({ title, onCloseModal = () => {} }) {
  const { t } = useTranslation();

  const [isModalTitleDeleteOpen, setIsModalTitleDeleteOpen] = useState(false);

  const handleCloseModalTitle = (updated) => {
    setIsModalTitleDeleteOpen(false);
    if (updated) {
      onCloseModal(true);
    }
  };

  return (
    <>
      <OykModalTitleDelete isOpen={isModalTitleDeleteOpen} onClose={handleCloseModalTitle} titleId={title.id} />
      <li className="oyk-universes-admin-module-reward-titles-list-item">
        <OykCard>
          <header className="oyk-universes-admin-module-reward-titles-list-item-info">
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
          <div className="oyk-universes-admin-module-reward-titles-list-item-actions">
            <OykButton outline onClick={() => {}}>
              {t("Edit")}
            </OykButton>
            <OykButton outline color="danger" icon={X} onClick={() => setIsModalTitleDeleteOpen(true)} />
          </div>
        </OykCard>
      </li>
    </>
  );
}
