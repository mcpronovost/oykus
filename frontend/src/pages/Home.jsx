import { useTranslation } from "@/services/translation";
import { OykHeading } from "@/components/common";

export default function Home() {
  const { t } = useTranslation();

  const fetchTest = async () => {
    const r = await fetch("/api/health");
    const data = await r.json();
    console.log(data);
  };

  fetchTest();

  return (
    <section className="oyk-page oyk-home">
      <OykHeading title={t("Home")} />a
    </section>
  );
}
