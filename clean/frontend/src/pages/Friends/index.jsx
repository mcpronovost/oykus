import "@/assets/styles/page/_settings.scss";
import { Smile, Construction } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykCard, OykFeedback, OykGrid, OykGridRow, OykGridNav, OykGridMain, OykHeading } from "@/components/ui";
import { OykSidenav } from "@/components/common";
import OykError404 from "@/pages/Error404";
import OykManageFriends from "./Friends";
import OykFriendsRequests from "./FriendsRequests";

export default function OykFriends() {
  const { isAuth } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();

  const menu = [
    {
      title: t("Friends"),
      description: t("Manage friends, accept and block requests"),
      Icon: Smile,
      links: [
        {
          name: t("Manage Friends"),
          routeName: "friends",
        },
        {
          name: t("Invites"),
          routeName: "friends-requests",
        },
        {
          name: t("Blocked Users"),
          routeName: "friends-blocked",
          disabled: true,
        },
      ],
    },
  ];

  if (!isAuth) {
    return <OykError404 />;
  }

  return (
    <section className="oyk-page oyk-settings">
      <OykHeading title={t("Friends")} />
      <OykGrid>
        <OykGridRow>
          <OykGridNav className="oyk-settings-grid-nav">
            <OykSidenav menu={menu} />
          </OykGridNav>
          <OykGridMain>
            {params?.section === "friends" ? (
              <OykManageFriends />
            ) : params?.section === "friends-requests" ? (
              <OykFriendsRequests />
            ) : (
              <OykCard>
                <OykFeedback
                  ghost
                  variant="warning"
                  title={t("Under Construction")}
                  message={t("These settings are currently in development and should be available soon")}
                  icon={Construction}
                />
              </OykCard>
            )}
          </OykGridMain>
        </OykGridRow>
      </OykGrid>
    </section>
  );
}
