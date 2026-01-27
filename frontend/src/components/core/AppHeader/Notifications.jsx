import { Bell, Mail, Smile } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton } from "@/components/ui";

export default function AppHeaderNotifications() {
  const { currentUser } = useAuth();
  const { n } = useRouter();
  const { t } = useTranslation();

  return (
    <section className="oyk-app-header-notifications">
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Bell}
          iconSize={18}
          badgeDot={currentUser?.notifications?.alerts}
          badgeBorderColor="var(--oyk-app-header-bg)"
        />
      </div>
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Smile}
          iconSize={18}
          badgeDot={currentUser?.notifications?.friends}
          badgeBorderColor="var(--oyk-app-header-bg)"
          onClick={() => (currentUser?.notifications?.friends ? n("settings-friends-requests") : n("settings-friends"))}
        />
      </div>
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Mail}
          iconSize={18}
          badgeDot={currentUser?.notifications?.messages}
          badgeBorderColor="var(--oyk-app-header-bg)"
        />
      </div>
    </section>
  );
}
