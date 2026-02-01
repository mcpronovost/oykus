import { Menu } from "lucide-react";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykButton, OykDropdown, OykLink, OykProgress } from "@/components/ui";

export default function AppHeaderLeveling() {
  const { n } = useRouter();
  const { t } = useTranslation();

  return (
    <section className="oyk-app-header-leveling">
        <span className="oyk-app-header-leveling-level">9</span>
        <OykProgress
          progress={11}
          goal={100}
          height={10}
          borderSize={2}
          borderColor="var(--oyk-app-header-bg-subtle)"
          trackColor="var(--oyk-app-header-bg-subtle)"
          thumbColor="linear-gradient(to right, var(--oyk-app-header-fg-subtle), var(--oyk-c-primary))"
        />
    </section>
  );
}
