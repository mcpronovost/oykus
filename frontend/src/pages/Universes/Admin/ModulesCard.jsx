import { useMemo } from "react";
import {
  CircleFadingArrowUp,
  GalleryHorizontalEnd,
  ListTodo,
  Mail,
  MessagesSquare,
  ScrollText,
  Star,
  Swords,
} from "lucide-react";

import { useTranslation } from "@/services/translation";
import { OykAlert, OykBanner, OykButton, OykCard } from "@/components/ui";

export default function UniverseAdminModulesCard({
  module,
  onActivate = () => {},
  onDeactivate = () => {},
  isLoading = false,
  hasError = null,
}) {
  const { t } = useTranslation();

  module.icon = useMemo(() => {
    switch (module.name) {
      case "planner":
        return ListTodo;
      case "blog":
        return ScrollText;
      case "forum":
        return MessagesSquare;
      case "courrier":
        return Mail;
      case "collectibles":
        return GalleryHorizontalEnd;
      case "rewards":
        return Star;
      case "game":
        return Swords;
      case "leveling":
        return CircleFadingArrowUp;
      default:
        return null;
    }
  }, [module.name]);

  return (
    <li className="oyk-universes-admin-modules-list-item">
      <OykCard nop fullCenter alignSpace>
        <header className="oyk-universes-admin-modules-list-item-header">
          <OykBanner avatarIcon={module.icon} avatarTop={16} avatarBorderSize={8} coverHeight={64} height={96} />
          <div className="oyk-universes-admin-modules-list-item-header-name">
            <span>{t(`mod.${module.name}.name`)}</span>
          </div>
          {!hasError ? (
            <div className="oyk-universes-admin-modules-list-item-header-description">
              <span>{t(`mod.${module.name}.description`)}</span>
            </div>
          ) : (
            <div className="oyk-universes-admin-modules-list-item-header-alert">
              <OykAlert variant="danger" message={t(hasError)} iconSize={20} small />
            </div>
          )}
        </header>
        <div className="oyk-universes-admin-modules-list-item-actions">
          {module.active ? (
            <OykButton
              small
              outline
              color="danger"
              isLoading={isLoading}
              onClick={() => {
                onDeactivate(module);
              }}
            >
              <span>{t("Deactivate")}</span>
            </OykButton>
          ) : module.disabled ? (
            <OykButton small outline disabled>
              <span>{t("Unavailable")}</span>
            </OykButton>
          ) : (
            <OykButton
              small
              outline
              color="success"
              isLoading={isLoading}
              onClick={() => {
                onActivate(module);
              }}
            >
              <span>{t("Activate")}</span>
            </OykButton>
          )}
          {/*!module.disabled ? (<OykButton outline icon={Info} />) : null*/}
        </div>
      </OykCard>
    </li>
  );
}
