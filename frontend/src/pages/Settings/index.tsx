import "@/assets/styles/pages/_settings.scss";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykButton, OykCard, OykGrid, OykHeading } from "@/components/ui";

export default function OykSettings() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const spaceId = user?.currentSpace?.id ?? null;

  if (!user?.currentSpace || !spaceId) return null;

  return (
    <div className="oyk-page-settings">
      <OykGrid>
        <OykHeading title={t("Settings")} suptitle={user.currentSpace.name} />
        <OykGrid.Row>
          <OykGrid.Col>
            <OykCard color="danger">
              <OykHeading
                tag="h2"
                title={t("Danger Zone")}
                subtitle={"Irreversible actions affecting your space"}
                icon={IconAlertTriangle}
                variant="card"
              />
              <OykGrid.Row nopb>
                <OykGrid.Col size={{ xs: 12, md: 18 }}>
                  <p className="oyk-page-settings-field-title">
                    Deactivate space
                  </p>
                  <small className="oyk-page-settings-field-description">
                    This will remove all data associated with this space and
                    make it unavailable to users.
                  </small>
                </OykGrid.Col>
                <OykGrid.Col
                  size={{ xs: 12, md: 6 }}
                  flex="horizontal"
                  justify="end"
                >
                  <OykButton label={t("Deactivate space")} color="danger" />
                </OykGrid.Col>
              </OykGrid.Row>
            </OykCard>
          </OykGrid.Col>
        </OykGrid.Row>
      </OykGrid>
    </div>
  );
}
