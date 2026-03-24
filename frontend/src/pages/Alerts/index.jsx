import { Bell } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykCard, OykFeedback, OykGrid, OykGridRow, OykGridNav, OykGridMain, OykHeading } from "@/components/ui";
import { OykSidenav } from "@/components/common";
import OykError404 from "@/pages/Error404";
import OykManageAlerts from "./Alerts";

export default function OykAlerts() {
  const { isAuth } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();

  const menu = [
    {
      title: t("Alerts"),
      description: t("Manage friends, accept and block requests"),
      Icon: Bell,
      links: [
        {
          name: t("All"),
          routeName: "alerts",
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
    <section className="oyk-page oyk-alerts">
      <OykHeading title={t("Alerts")} />
      <OykGrid>
        <OykGridRow>
          <OykGridNav>
            <OykSidenav menu={menu} />
          </OykGridNav>
          <OykGridMain>
            {params?.section === "alerts" ? (
              <OykManageAlerts />
            ) : (
              <OykCard>
                <OykFeedback
                  ghost
                  variant="warning"
                  title={t("Not Found")}
                />
              </OykCard>
            )}
          </OykGridMain>
        </OykGridRow>
      </OykGrid>
    </section>
  );
}
