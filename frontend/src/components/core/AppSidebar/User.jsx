import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { OykBanner } from "@/components/ui";

export default function User() {
  const { currentUser } = useAuth();
  const { storeAppSidebarOpen } = useStore();

  if (!currentUser) {
    return null;
  }

  return (
    <section className="oyk-app-sidebar-user">
      <OykBanner
        avatarSrc={currentUser.avatar}
        avatarBorderSize={4}
        avatarBorderColor="var(--oyk-app-sidebar-bg)"
        avatarSize={storeAppSidebarOpen ? 96 : 32}
        avatarTop={storeAppSidebarOpen ? 24 : 12}
        avatarLevel={1}
        avatarLevelSize={storeAppSidebarOpen ? 24 : 16}
        avatarLevelBorderSize={storeAppSidebarOpen ? 4 : 2}
        avatarLevelBorderColor="var(--oyk-app-sidebar-bg)"
        coverSrc={currentUser.cover}
        coverHeight={storeAppSidebarOpen ? 72 : 32}
        coverRadius="0"
        height={storeAppSidebarOpen ? 132 : 64}
      />
      <section className={`oyk-app-sidebar-user-identity ${storeAppSidebarOpen ? '' : 'hidden'}`}>
        <div className="oyk-app-sidebar-user-identity-name">
            {currentUser.name}
        </div>
        <div className="oyk-app-sidebar-user-identity-title">
            Qui ne fait que passer
        </div>
      </section>
    </section>
  );
}
