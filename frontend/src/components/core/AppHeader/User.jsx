import { LogOut, ListTodo, GalleryHorizontalEnd } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykAvatar, OykDropdown } from "@/components/common";

export default function AppHeaderUser() {
  const { currentUser, setUser, setRat } = useAuth();
  const { n } = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      setRat(null);
    } finally {
      n("login");
    }
  };

  return (
    <section className="oyk-app-header-user">
      <OykDropdown
        toggle={
          <button className="oyk-app-header-user-button">
            <span className="oyk-app-header-user-button-name">{currentUser.name}</span>
            <OykAvatar size={36} src={currentUser.avatar} name={currentUser.name} abbr={currentUser.abbr} />
          </button>
        }
        menu={[
          {
            label: t("Your profile"),
            onClick: () => n("users-profile", { userSlug: currentUser.slug }),
          },
          {
            divider: true,
          },
          {
            label: t("Your cards"),
            icon: <GalleryHorizontalEnd size={18} />,
            disabled: true,
            onClick: () => {},
          },
          {
            label: t("Your tasks"),
            icon: <ListTodo size={18} />,
            disabled: true,
            onClick: () => {},
          },
          {
            divider: true,
          },
          {
            label: t("Logout"),
            icon: <LogOut size={18} />,
            onClick: handleLogout,
          },
        ]}
      />
    </section>
  );
}