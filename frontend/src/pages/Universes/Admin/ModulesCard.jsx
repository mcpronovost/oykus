import { Info } from "lucide-react";

import { useTranslation } from "@/services/translation";
import { OykBanner, OykButton, OykCard } from "@/components/ui";

export default function UniverseAdminModulesCard({ module }) {
  const { t } = useTranslation();

  return (
    <li className="oyk-universes-admin-modules-list-item">
      <OykCard nop fh alignSpace>
        <header className="oyk-universes-admin-modules-list-item-header">
          <OykBanner avatarIcon={module.icon} avatarTop={16} avatarBorderSize={8} coverHeight={64} height={96} />
          <div className="oyk-universes-admin-modules-list-item-header-name">
            <span>{module.name}</span>
          </div>
          <div className="oyk-universes-admin-modules-list-item-header-title">
            <span>{module.description}</span>
          </div>
        </header>
        <div className="oyk-universes-admin-modules-list-item-actions">
          {module.disabled ? (
            <OykButton small outline disabled>
              <span>{t("Unavailable")}</span>
            </OykButton>
          ) : module.active ? (
            <OykButton small outline color="danger" onClick={() => {}}>
              <span>{t("Deactivate")}</span>
            </OykButton>
          ) : (
            <OykButton small outline color="success" onClick={() => {}}>
              <span>{t("Activate")}</span>
            </OykButton>
          )}
          {/*!module.disabled ? (<OykButton outline icon={Info} />) : null*/}
        </div>
      </OykCard>
    </li>
  );
}
