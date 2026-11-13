import "@/assets/styles/pages/_encyclopedia.scss";
import { IconUsers, IconCrown, IconMap, IconLeaf, IconShield, IconFlare, IconNews } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { useTranslation } from "@/services/translation";
import { OykGrid, OykHeading } from "@/components/ui";
import OykEncyclopediaTopicsCard from "./TopicsCard";

export default function OykEncyclopedia() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user?.currentSpace) return null;

  return (
    <div className="oyk-page-encyclopedia">
      <OykGrid>
        <OykHeading title={t("Encyclopedia")} suptitle={user.currentSpace.name} />
        <OykGrid.Row>
          <OykGrid.Col>
            <div className="oyk-page-encyclopedia-topics">
              <OykEncyclopediaTopicsCard label={t("Characters")} value={0} icon={IconUsers} color="accent" />
              <OykEncyclopediaTopicsCard label={t("Factions")} value={0} icon={IconCrown} color="info" />
              <OykEncyclopediaTopicsCard label={t("Locations")} value={0} icon={IconMap} color="special" />
              <OykEncyclopediaTopicsCard label={t("Nature")} value={0} icon={IconLeaf} color="success" />
              <OykEncyclopediaTopicsCard label={t("Items")} value={0} icon={IconShield} color="info" />
              <OykEncyclopediaTopicsCard label={t("Events")} value={0} icon={IconFlare} color="special" />
              <OykEncyclopediaTopicsCard label={t("Lore")} value={0} icon={IconNews} color="accent" />
            </div>
          </OykGrid.Col>
        </OykGrid.Row>
      </OykGrid>
    </div>
  );
}
