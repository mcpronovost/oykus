import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykButton, OykDialog } from "@/components/ui";
import ImgUser from "@/assets/img/space-avatar-1.jpg";

export default function OykCoreHeaderUser() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <OykDialog placement="bottom" className="oyk-core-header-user" nop content={
      <nav className="oyk-core-header-user-menu">
        <div className="oyk-core-header-user-menu-item">
          <OykButton routeName="logout" label={t("Logout")} variant="plain" justify="start" shrink grow start={IconLogout} />
        </div>
      </nav>
    }>
      <div className="oyk-core-header-user-name">
        <span className="oyk-core-header-user-name-title">{user?.name}</span>
        <span className="oyk-core-header-user-name-subtitle">Niveau 1</span>
      </div>
      <div className="oyk-core-header-user-avatar">
        <div className="oyk-core-header-user-avatar-img">
          <img src={user?.avatar || ImgUser} alt="User" />
        </div>
      </div>
    </OykDialog>
  );
}
