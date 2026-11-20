import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import {
  OykGrid,
  OykHeading,
  OykResult,
} from "@/components/ui";

export default function OykProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="oyk-page-profile">
      <OykGrid>
        <OykHeading title={t("Profile")} suptitle={user.name} />
      </OykGrid>
      <OykGrid>
        <OykResult
          title={t("Profile")}
          message={t("This is your profile page. You can view and edit your personal information here.")}
        />
      </OykGrid>
    </div>
  );
}
