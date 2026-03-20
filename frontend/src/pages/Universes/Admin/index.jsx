import "@/assets/styles/page/_universes-admin.scss";
import {
  CircleFadingArrowUp,
  Construction,
  Eye,
  ListTodo,
  MessagesSquare,
  Orbit,
  Paintbrush,
  ScrollText,
} from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";

import {
  OykButton,
  OykCard,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridNav,
  OykGridMain,
  OykHeading,
} from "@/components/ui";
import { OykSidenav } from "@/components/common";
import OykError404 from "@/pages/Error404";
import OykUniverseAdminProfile from "./Profile";
import OykUniverseAdminModules from "./Modules";
import OykUniverseAdminModuleBlog from "./ModuleBlog";
import OykUniverseAdminModuleForum from "./ModuleForum";
import OykUniverseAdminModulePlanner from "./ModulePlanner";
import OykUniverseAdminModuleProgress from "./ModuleProgress";
import OykUniverseAdminModuleProgressTitles from "./ModuleProgressTitles";
import OykUniverseAdminTheme from "./Theme";
import OykUniverseAdminThemeStylesheet from "./ThemeStylesheet";

export default function UniverseAdmin() {
  const { isAuth } = useAuth();
  const { n, params } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse } = useWorld();

  const menu = [
    {
      id: "profile",
      title: t("Profile"),
      description: t("Change identity, logo, description, and more"),
      Icon: Orbit,
      links: [
        {
          name: t("General"),
          routeName: "universe-admin-profile",
          params: { universeSlug: params?.universeSlug },
        },
        {
          name: t("Manage Modules"),
          routeName: "universe-admin-modules",
          params: { universeSlug: params?.universeSlug },
        },
      ],
    },
    {
      id: "theme",
      title: t("Theme"),
      description: t("Change visual identity, colours and stylesheet"),
      Icon: Paintbrush,
      links: [
        {
          name: t("General"),
          routeName: "universe-admin-theme",
          params: { universeSlug: params?.universeSlug },
        },
        {
          name: t("Stylesheet"),
          routeName: "universe-admin-stylesheet",
          params: { universeSlug: params?.universeSlug },
        },
      ],
    },
    ...(currentUniverse?.modules?.blog?.active
      ? [
          {
            id: "modules-blog",
            title: t("Blog"),
            description: t("mod.blog.description"),
            Icon: ScrollText,
            links: [
              {
                name: t("Settings"),
                routeName: "universe-admin-modules-blog",
                params: { universeSlug: params?.universeSlug },
              },
            ],
          },
        ]
      : []),
    ...(currentUniverse?.modules?.forum?.active
      ? [
          {
            id: "modules-forum",
            title: t("Forum"),
            description: t("mod.forum.description"),
            Icon: MessagesSquare,
            links: [
              {
                name: t("Settings"),
                routeName: "universe-admin-modules-forum",
                params: { universeSlug: params?.universeSlug },
              },
            ],
          },
        ]
      : []),
    ...(currentUniverse?.modules?.planner?.active
      ? [
          {
            id: "modules-planner",
            title: t("Planner"),
            description: t("mod.planner.description"),
            Icon: ListTodo,
            links: [
              {
                name: t("Settings"),
                routeName: "universe-admin-modules-planner",
                params: { universeSlug: params?.universeSlug },
              },
            ],
          },
        ]
      : []),
    ...(currentUniverse?.modules?.progress?.active
      ? [
          {
            id: "modules-progress",
            title: t("Progress"),
            description: t("mod.progress.description"),
            Icon: CircleFadingArrowUp,
            links: [
              {
                name: t("Settings"),
                routeName: "universe-admin-modules-progress",
                params: { universeSlug: params?.universeSlug },
              },
              {
                name: t("Challenges"),
                routeName: "universe-admin-modules-progress-challenges",
                params: { universeSlug: params?.universeSlug },
                disabled: true,
              },
              {
                name: t("Achievements"),
                routeName: "universe-admin-modules-progress-achievements",
                params: { universeSlug: params?.universeSlug },
                disabled: true,
              },
              {
                name: t("Titles"),
                routeName: "universe-admin-modules-progress-titles",
                params: { universeSlug: params?.universeSlug },
              },
            ],
          },
        ]
      : []),
  ];

  if (!isAuth || !currentUniverse || currentUniverse.slug !== params?.universeSlug || currentUniverse.role !== 1) {
    return <OykError404 />;
  }

  return (
    <section className="oyk-page oyk-universes-admin">
      <OykHeading
        title={t("Administration")}
        actions={
          <OykButton icon={Eye} outline small onClick={() => n("universe", { universeSlug: params?.universeSlug })}>
            {t("View Universe")}
          </OykButton>
        }
      />
      <OykGrid>
        <OykGridRow>
          <OykGridNav className="oyk-universes-admin-grid-nav">
            <OykSidenav menu={menu} accordion />
          </OykGridNav>
          <OykGridMain>
            {params?.section === "profile" ? (
              <OykUniverseAdminProfile />
            ) : params?.section === "modules" ? (
              <OykUniverseAdminModules />
            ) : params?.section === "modules-blog" ? (
              <OykUniverseAdminModuleBlog />
            ) : params?.section === "modules-forum" ? (
              <OykUniverseAdminModuleForum />
            ) : params?.section === "modules-planner" ? (
              <OykUniverseAdminModulePlanner />
            ) : params?.section === "modules-progress" ? (
              <OykUniverseAdminModuleProgress />
            ) : params?.section === "modules-progress-titles" ? (
              <OykUniverseAdminModuleProgressTitles />
            ) : params?.section === "theme" ? (
              <OykUniverseAdminTheme />
            ) : params?.section === "stylesheet" ? (
              <OykUniverseAdminThemeStylesheet />
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
