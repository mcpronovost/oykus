import { useTranslation } from "@/services/translation";
import { OykKanban } from "@/components/common";
import { OykGrid } from "@/components/ui";

export default function OykApp() {
  const { t } = useTranslation();

  return (
    <div className="oyk-core">
      <div className="oyk-titlebar" role="banner">
        <span className="oyk-titlebar-brand">Oykus</span>
      </div>
      <nav className="oyk-core-nav">
        <span>aaa</span>
        <span>bbb</span>
      </nav>
      <main id="oyk-main" className="oyk-core-main">
        <header className="oyk-core-main-header">{t("hello")}</header>
        <OykGrid>
          <OykGrid.Row>
            <OykGrid.Col>
              <div className="oyk-tracker">
                <OykKanban />
              </div>
            </OykGrid.Col>
          </OykGrid.Row>
        </OykGrid>
      </main>
    </div>
  );
}
