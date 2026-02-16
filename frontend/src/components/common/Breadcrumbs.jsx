import { useMemo } from "react";
import { ChevronRight, Orbit } from "lucide-react";

import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";

import { OykLink } from "@/components/ui";

export default function OykBlogPost() {
  const { currentUniverse } = useAuth();
  const { route, params, breads } = useRouter();
  const { lang } = useTranslation();

  const crumbs = useMemo(() => breads(route.name, lang), [route, lang]);

  return (
    <section className="oyk-breadcrumbs">
      <ul className="oyk-breadcrumbs-list">
        {crumbs.map((b, index) => {
          if (index === crumbs.length - 1 || b.path === "u") return null;
          return (
            <li key={index} className="oyk-breadcrumbs-list-item">
              {b.path.endsWith("/{universeSlug}") ? (
                <>
                  <Orbit size={14} />{" "}
                  <OykLink routeName={b.name} params={params} colorHover="primary">
                    {currentUniverse?.name}
                  </OykLink>
                </>
              ) : (
                <>
                  <ChevronRight size={14} />{" "}
                  <OykLink routeName={b.name} params={params} colorHover="primary">
                    {currentUniverse ?? b.name === "blog" ? currentUniverse?.modules?.blog?.settings?.display_name || b.label : b.label}
                  </OykLink>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
