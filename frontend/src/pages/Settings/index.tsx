import "@/assets/styles/pages/_settings.scss";
import { useState } from "react";
import { IconAlertTriangle, IconUpload } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import {
  OykButton,
  OykCard,
  OykForm,
  OykGrid,
  OykHeading,
} from "@/components/ui";
import ImgPlaceholder1 from "@/assets/img/space-cover-1.webp";

export default function OykSettings() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const spaceId = user?.currentSpace?.id ?? null;

  const [form, setForm] = useState({
    name: user?.currentSpace?.name ?? "",
    description: user?.currentSpace?.description ?? "",
  });

  if (!user?.currentSpace || !spaceId) return null;

  return (
    <div className="oyk-page-settings">
      <OykGrid>
        <OykHeading title={t("Settings")} suptitle={user.currentSpace.name} />
      </OykGrid>
      <OykForm>
        <OykGrid>
          <OykGrid.Row>
            <OykGrid.Col>
              <div className="oyk-page-settings-general">
                <div className="oyk-page-settings-general-cover">
                  <div className="oyk-page-settings-general-cover-img-wrapper">
                    <img
                      src={user?.currentSpace?.cover || ImgPlaceholder1}
                      alt={user?.currentSpace?.name}
                      className="oyk-page-settings-general-cover-img"
                    />
                    <button className="oyk-page-settings-general-cover-btn">
                      <IconUpload size={64} stroke={1} />
                    </button>
                  </div>
                  <p className="oyk-page-settings-general-cover-size">400x568</p>
                </div>
                <OykCard>
                  <OykHeading
                    tag="h2"
                    title={t("General")}
                    subtitle={t("settings.general.subtitle")}
                    variant="card"
                  />
                  <OykGrid.Row nopb>
                    <OykGrid.Col>
                      <OykForm.Field
                        name="name"
                        label={t("Name")}
                        value={form.name}
                      />
                      <OykForm.Field
                        name="description"
                        type="textarea"
                        label={t("Description")}
                        value={form.description}
                      />
                    </OykGrid.Col>
                  </OykGrid.Row>
                  <OykGrid.Row nopb>
                    <OykGrid.Col flex="horizontal" justify="end">
                      <OykButton label={t("Reset")} variant="ghost" />
                      <OykButton label={t("Save")} color="accent" />
                    </OykGrid.Col>
                  </OykGrid.Row>
                </OykCard>
              </div>
            </OykGrid.Col>
          </OykGrid.Row>
        </OykGrid>
      </OykForm>
      {/* Danger Zone */}
      <OykGrid>
        <OykGrid.Row>
          <OykGrid.Col>
            <OykCard color="danger">
              <OykHeading
                tag="h2"
                title={t("settings.dangerzone.title")}
                subtitle={t("settings.dangerzone.subtitle")}
                icon={IconAlertTriangle}
                variant="card"
              />
              <OykGrid.Row nopb>
                <OykGrid.Col size={{ xs: 12, md: 18 }}>
                  <p className="oyk-page-settings-field-title">
                    {t("settings.dangerzone.deactivatespace")}
                  </p>
                  <small className="oyk-page-settings-field-description">
                    {t("settings.dangerzone.deactivatespacedescription")}
                    <br />
                    {t("settings.dangerzone.deactivatespacenote")}
                  </small>
                </OykGrid.Col>
                <OykGrid.Col
                  size={{ xs: 12, md: 6 }}
                  flex="horizontal"
                  justify="end"
                >
                  <OykButton
                    label={t("settings.dangerzone.deactivatespace")}
                    color="danger"
                    variant="ghost"
                  />
                </OykGrid.Col>
                <OykGrid.Col size={{ xs: 12, md: 18 }}>
                  <p className="oyk-page-settings-field-title">
                    {t("settings.dangerzone.deletespacemanually")}
                  </p>
                  <small className="oyk-page-settings-field-description">
                    {t("settings.dangerzone.deletespacemanuallydescription")}
                    <br />
                    {t("settings.dangerzone.deletespacemanuallynote")}
                  </small>
                </OykGrid.Col>
                <OykGrid.Col
                  size={{ xs: 12, md: 6 }}
                  flex="horizontal"
                  justify="end"
                >
                  <OykButton
                    label={t("settings.dangerzone.deletespacemanually")}
                    color="danger"
                  />
                </OykGrid.Col>
              </OykGrid.Row>
            </OykCard>
          </OykGrid.Col>
        </OykGrid.Row>
      </OykGrid>
    </div>
  );
}
