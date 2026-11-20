import { IconUser, IconLogout } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykAvatar, OykButton, OykDialog } from "@/components/ui";
import ImgUser from "@/assets/img/space-avatar-1.jpg";

export default function OykCoreHeaderUser() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <OykDialog
      placement="bottom"
      className="oyk-core-header-user"
      nop
      content={
        <nav className="oyk-core-header-user-menu">
          <ul className="oyk-core-header-user-menu-list">
            <li className="oyk-core-header-user-menu-item">
              <OykButton
                routeName="profile"
                label={t("Profile")}
                variant="plain"
                justify="start"
                shrink
                grow
                start={IconUser}
              />
            </li>
            <li className="oyk-core-header-user-menu-item">
              <OykButton
                routeName="logout"
                label={t("Logout")}
                variant="plain"
                justify="start"
                shrink
                grow
                start={IconLogout}
              />
            </li>
          </ul>
        </nav>
      }
    >
      <div className="oyk-core-header-user-name">
        <span className="oyk-core-header-user-name-title">{user?.name}</span>
        <span className="oyk-core-header-user-name-subtitle">Niveau 1</span>
      </div>
      <div className="oyk-core-header-user-avatar">
        <OykAvatar src={user?.avatar || ImgUser} alt={user?.name} size={48} />
      </div>
      <div className="oyk-core-header-user-avatar">
        <OykAvatar src={user?.avatar} alt={user?.name} size={48} />
        {/*<div className="oyk-core-header-user-avatar-img">
          <img src={user?.avatar || ImgUser} alt="User" />
        </div>*/}
      </div>
    </OykDialog>
  );
}
