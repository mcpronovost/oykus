import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useWorld } from "@/services/world";

import { OykAvatar, OykBanner } from "@/components/ui";

export default function User() {
  const { currentUser } = useAuth();
  const { storeAppSidebarOpen } = useStore();
  const { currentCharacter } = useWorld();

  if (!currentUser) {
    return null;
  }

  return (
    <section className="oyk-app-sidebar-user">
      <OykBanner
        avatarSrc={currentCharacter ? currentCharacter.avatar : currentUser.avatar}
        avatarBorderSize={4}
        avatarBorderColor="var(--oyk-app-sidebar-bg)"
        avatarSize={storeAppSidebarOpen ? 96 : 32}
        avatarTop={storeAppSidebarOpen ? 24 : 12}
        avatarShowOnline={false}
        avatarLevel={1}
        avatarLevelSize={storeAppSidebarOpen ? 24 : 16}
        avatarLevelBorderSize={storeAppSidebarOpen ? 4 : 2}
        avatarLevelBorderColor="var(--oyk-app-sidebar-bg)"
        coverSrc={currentCharacter ? currentCharacter.cover : currentUser.cover}
        coverHeight={storeAppSidebarOpen ? 72 : 32}
        coverRadius="0"
        height={storeAppSidebarOpen ? 132 : 64}
      />
      {currentCharacter && (
        <section className="oyk-app-sidebar-user-auth">
          <OykAvatar size={32} src={currentUser.avatar} abbr={currentUser.abbr} name={currentUser.name} />
        </section>
      )}
      <section className={`oyk-app-sidebar-user-identity ${storeAppSidebarOpen ? "" : "hidden"}`}>
        <div className="oyk-app-sidebar-user-identity-name">
          {currentCharacter ? currentCharacter.name : currentUser.name}
        </div>
        {currentCharacter ? (
          currentCharacter.title && <div className="oyk-app-sidebar-user-identity-title">{currentCharacter.title}</div>
        ) : (
          <div className="oyk-app-sidebar-user-identity-title">Qui ne fait que passer</div>
        )}
      </section>
    </section>
  );
}
