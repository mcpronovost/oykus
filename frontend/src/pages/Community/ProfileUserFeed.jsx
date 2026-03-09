import { useState } from "react";
import { Ellipsis, Frown } from "lucide-react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";

import { OykAvatar, OykButton, OykCard, OykDropdown, OykFeedback } from "@/components/ui";

export default function OykProfileUserFeed({ feed = [] }) {
  const { t } = useTranslation();

  return (
    <section className="oyk-userprofile-feed">
      {feed && feed.length > 0
        ? feed.map((post) => (
            <article className="oyk-userprofile-feed-post">
              <OykCard>
                <header className="oyk-userprofile-feed-post-header">
                  <OykAvatar size={48} src={post.avatar} />
                  <div className="oyk-userprofile-feed-post-header-identity">
                    <div className="oyk-userprofile-feed-post-header-identity-name">
                      <span>{post.name}</span>
                    </div>
                    <div className="oyk-userprofile-feed-post-header-identity-date">
                      <span>5 hours ago</span>
                    </div>
                  </div>
                  <div className="oyk-userprofile-feed-post-header-actions">
                    <OykDropdown
                      float
                      toggle={<OykButton icon={Ellipsis} plain />}
                      menu={[
                        {
                          label: t("Report"),
                          // icon: <Pencil size={16} />,
                          onClick: () => {},
                        },
                      ]}
                    />
                  </div>
                </header>
                <div className="oyk-code">
                  Il y a tant de choses qui vous passe par la tête lorsque vous êtes seul avec vous-même. Lorsque plus
                  rien ne semble avoir de sens, ou de but, ou de raison. Comme l'instant présent. Il savait le comment,
                  il ignorait le pourquoi. Enfin. Certains doutes étaient plus évidents que d'autres, des doutes à vous
                  en faire reluire l'ego. Mais dans la pénombre crasse des remous de la mer, l'ego ne lui offrit ni
                  chaleur ni réconfort quant à sa situation. Et plus les jours passaient, plus il craignait ce qui lui
                  apparut vite comme une évidence.
                </div>
              </OykCard>
            </article>
          ))
        : (
          <>
            <OykFeedback ghost title={t("No posts")} message={t("This user has no activity at the moment")} icon={Frown} />
          </>
        )}
    </section>
  );
}
