import { useAuth } from "@/services/auth";
import { useStore } from "@/services/store";
import { useWorld } from "@/services/world";

import { OykBanner } from "@/components/ui";

export default function OykCoreGamebarCharacter() {
  const { currentUser } = useAuth();
  const { storeCoreGamebarOpen } = useStore();
  const { currentCharacter } = useWorld();

  if (!currentCharacter) {
    return null;
  }

  return (
    <section className="oyk-core-gamebar-user">
      <OykBanner
        avatarSrc={currentCharacter.avatar}
        avatarBorderSize={4}
        avatarBorderColor="var(--oyk-core-gamebar-bg)"
        avatarSize={storeCoreGamebarOpen ? 96 : 32}
        avatarTop={storeCoreGamebarOpen ? 24 : 12}
        avatarShowOnline={false}
        avatarLevel={1}
        avatarLevelSize={storeCoreGamebarOpen ? 24 : 16}
        avatarLevelBorderSize={storeCoreGamebarOpen ? 4 : 2}
        avatarLevelBorderColor="var(--oyk-core-gamebar-bg)"
        coverSrc={currentCharacter.cover || currentCharacter.avatar}
        coverHeight={storeCoreGamebarOpen ? 72 : 32}
        coverRadius="0"
        height={storeCoreGamebarOpen ? 132 : 64}
      />
      <section className={`oyk-core-gamebar-user-identity ${storeCoreGamebarOpen ? "" : "hidden"}`}>
        <div className="oyk-core-gamebar-user-identity-name">
          {currentCharacter.name}
        </div>
        {currentCharacter.title && (
          <div className="oyk-core-gamebar-user-identity-title">{currentCharacter.title}</div>
        )}
      </section>
    </section>
  );
}
