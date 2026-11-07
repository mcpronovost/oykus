import { useState } from "react";
import {
  IconLayoutGrid,
  IconBooks,
  IconNote,
  IconPlus,
  IconComponents,
  IconSettings,
} from "@tabler/icons-react";
import { oykClass } from "@/utils";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import {
  OykDialog,
  OykScrollbar,
  OykSpacer,
  OykTooltip,
} from "@/components/ui";
import OykCoreSidebarNavLink from "./NavLink";

const APP_VERSION = "0.4.0";

export default function OykCoreSidebar() {
  const { isAuth } = useAuth();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!isAuth) return null;

  return (
    <div className="oyk-core-sidebar">
      <OykScrollbar flex>
        <nav className="oyk-core-sidebar-nav">
          <ul className="oyk-core-sidebar-nav-list" aria-label={t("Tools")}>
            <OykCoreSidebarNavLink
              routeName="dashboard"
              label={t("Dashboard")}
              icon={IconLayoutGrid}
            />
            <OykCoreSidebarNavLink
              routeName="encyclopedia"
              label={t("Encyclopedia")}
              icon={IconBooks}
            />
            <OykCoreSidebarNavLink
              routeName="notes"
              label={t("Notes")}
              icon={IconNote}
            />
          </ul>
          <ul className="oyk-core-sidebar-nav-list" aria-label={t("Plugins")}>
            <OykCoreSidebarNavLink
              label={t("Add plugins")}
              icon={IconPlus}
              size="sm"
            />
          </ul>
          <OykSpacer />
          <ul
            className="oyk-core-sidebar-nav-list"
            aria-label={t("Preferences")}
          >
            <OykCoreSidebarNavLink
              routeName="dev-components"
              label={t("Dev")}
              icon={IconComponents}
            />
            <li className="oyk-core-sidebar-nav-list-item">
              <OykDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                placement="right"
                offset={24}
                content={
                  <div className="oyk-core-sidebar-settings">
                    <label
                      className="oyk-core-sidebar-settings-field"
                      htmlFor="oyk-settings-space"
                    >
                      <span className="oyk-core-sidebar-settings-label">
                        {t("Space")}
                      </span>
                      <select
                        id="oyk-settings-space"
                        className="oyk-core-sidebar-settings-select"
                        disabled
                        value="default"
                      >
                        <option value="default">{t("My space")}</option>
                      </select>
                    </label>
                    <p className="oyk-core-sidebar-settings-version">
                      v{APP_VERSION}
                    </p>
                  </div>
                }
              >
                <OykTooltip content={t("Settings")} disabled={settingsOpen}>
                  <div
                    className={oykClass(
                      "oyk-core-sidebar-nav-link",
                      settingsOpen && "oyk-active",
                    )}
                  >
                    <div className="oyk-core-sidebar-nav-link-content">
                      <span className="oyk-core-sidebar-nav-link-icon">
                        <IconSettings size={24} stroke={1.5} />
                      </span>
                    </div>
                  </div>
                </OykTooltip>
              </OykDialog>
            </li>
          </ul>
        </nav>
      </OykScrollbar>
    </div>
  );
}
