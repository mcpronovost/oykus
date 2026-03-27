import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";

import { OykBanner } from "@/components/ui";

export default function OykCoreNavbarUser({ isGameMode }) {
  const { currentUser } = useAuth();
  const { storeCoreNavbarOpen } = useStore();

  if (!currentUser) {
    return null;
  }

  return (
    <section className="oyk-core-navbar-user">
      <OykBanner
        avatarSrc={currentUser.avatar}
        avatarBorderSize={4}
        avatarBorderColor="var(--oyk-core-navbar-bg)"
        avatarSize={storeCoreNavbarOpen && !isGameMode ? 96 : 32}
        avatarTop={storeCoreNavbarOpen && !isGameMode ? 24 : 12}
        avatarShowOnline={false}
        avatarLevel={1}
        avatarLevelSize={storeCoreNavbarOpen && !isGameMode ? 24 : 16}
        avatarLevelBorderSize={storeCoreNavbarOpen && !isGameMode ? 4 : 2}
        avatarLevelBorderColor="var(--oyk-core-navbar-bg)"
        coverSrc={currentUser.cover}
        coverHeight={storeCoreNavbarOpen && !isGameMode ? 72 : 32}
        coverRadius="0"
        height={storeCoreNavbarOpen && !isGameMode ? 132 : 64}
      />
      <section className={`oyk-core-navbar-user-identity ${storeCoreNavbarOpen && !isGameMode ? "" : "hidden"}`}>
        <div className="oyk-core-navbar-user-identity-name">
          {currentUser.name}
        </div>
        {currentUser.title && (
          <div className="oyk-core-navbar-user-identity-title">{currentUser.title}</div>
        )}
      </section>
    </section>
  );
}
