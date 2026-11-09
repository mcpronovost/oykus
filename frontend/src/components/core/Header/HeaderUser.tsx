import { IconUser } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import ImgUser from "@/assets/img/space-avatar-1.jpg";

export default function OykCoreHeaderUser() {
  const { user } = useAuth();

  return (
    <div className="oyk-core-header-user">
      <div className="oyk-core-header-user-name">
        <span className="oyk-core-header-user-name-title">{user?.name}</span>
        <span className="oyk-core-header-user-name-subtitle">Niveau 2</span>
      </div>
      <div className="oyk-core-header-user-avatar">
        <div className="oyk-core-header-user-avatar-img">
          {/* <IconUser /> */}
          <img src={user?.avatar || ImgUser} alt="User" />
        </div>
      </div>
    </div>
  );
}
