import { IconBell, IconUser } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { OykButton, OykSpacer } from "@/components/ui";
import ImgLogo from "@/assets/img/oykus-48.webp";
import ImgUser from "@/assets/img/avt/tyryn.jpg";

export default function OykCoreHeader() {
  const { isAuth } = useAuth();

  if (!isAuth) return null;

  return (
    <div className="oyk-core-header">
      <div className="oyk-core-header-brand">
        <div className="oyk-core-header-brand-logo">
          <img src={ImgLogo} alt="Oykus" />
        </div>
        <div className="oyk-core-header-brand-name">
          <span className="oyk-core-header-brand-name-title">Oykus</span>
          <span className="oyk-core-header-brand-name-subtitle">
            Storytelling Planner
          </span>
        </div>
      </div>
      {/* TODO: Relative menu */}
      <OykSpacer />
      <div className="oyk-core-header-social">
        <OykButton icon={IconBell} iconSize={19} disabled />
      </div>
      <div className="oyk-core-header-user">
        <div className="oyk-core-header-user-name">
          <span className="oyk-core-header-user-name-title">M-C Pronovost</span>
          <span className="oyk-core-header-user-name-subtitle">Niveau 2</span>
        </div>
        <div className="oyk-core-header-user-avatar">
          <div className="oyk-core-header-user-avatar-img">
            {/* <IconUser /> */}
            <img src={ImgUser} alt="User" />
          </div>
        </div>
      </div>
    </div>
  );
}
