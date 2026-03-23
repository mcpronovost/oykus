import { useRef } from "react";
import { Bell, Mail, Smile, ScrollText } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useNotifications } from "@/services/notifications";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAvatar, OykButton, OykDropdown, OykLink } from "@/components/ui";

export default function AppHeaderNotifications() {
  const { isAuth } = useAuth();
  const { notifications } = useNotifications();
  const { n } = useRouter();
  const { t, lang } = useTranslation();

  const dropdownRef = useRef(null);

  if (!isAuth) return null;

  return (
    <section className="oyk-app-header-notifications">
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Bell}
          iconSize={18}
          badgeDot={notifications?.alerts}
          badgeBorderColor="var(--oyk-app-header-bg)"
        />
      </div>
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Smile}
          iconSize={18}
          badgeDot={notifications?.friends}
          badgeBorderColor="var(--oyk-app-header-bg)"
          onClick={() => (notifications?.friends ? n("friends-requests") : n("friends"))}
        />
      </div>
      <div className="oyk-app-header-notifications-group">
        <OykButton
          plain
          icon={Mail}
          iconSize={18}
          badgeDot={notifications?.messages}
          badgeBorderColor="var(--oyk-app-header-bg)"
          disabled
        />
      </div>
    </section>
  );
}
