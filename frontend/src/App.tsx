import { useTranslation } from "@/services/translation";
import { OykKanban } from "@/components/common";

export default function OykApp() {
  const { t } = useTranslation();

  return (
    <div className="oyk-core">
      <nav className="oyk-core-nav">
        <span>aaa</span>
        <span>bbb</span>
      </nav>
      <main className="oyk-core-main">
        <header className="oyk-core-main-header">{t("hello")}</header>
        <div className="oyk-tracker">
          <OykKanban />
        </div>
      </main>
    </div>
  );
}
