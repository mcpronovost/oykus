import { useTranslation } from "@/services/translation";
import { OykHeading } from "@/components/common";

export default function Discover() {
  const { t } = useTranslation();

  return (
    <section className="oyk-page oyk-discover">
      <OykHeading title={t("Discover")} />
    </section>
  );
}