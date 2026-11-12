import { useAuth } from "@/services/auth";
import { OykDialog } from "@/components/ui";
import ImgUser from "@/assets/img/space-avatar-1.jpg";

export default function OykCoreHeaderUser() {
  const { user } = useAuth();

  return (
    <OykDialog placement="bottom" className="oyk-core-header-user" content={<div>aaa</div>}>
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
