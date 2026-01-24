import { Lock } from "lucide-react";
import { useTranslation } from "@/services/translation";
import { OykChip, OykProgress } from "@/components/ui";

import imgFirstLogin from "@/assets/img/achievements/first_login.png";
import imgFirstCollectible from "@/assets/img/achievements/first_collectible.png";
import imgThreeNewCollectibles from "@/assets/img/achievements/three_new_collectibles.png";

export default function AchievementCard({ achievement }) {
  const { t } = useTranslation();
  const { title, description, tag, is_unlocked, period, progress, goal } = achievement;

  return (
    <article
      className={`oyk-achievements-card ${period} ${is_unlocked ? "oyk-unlocked" : "oyk-locked"}`}
      
    >
      <div className="oyk-achievements-card-overlay" style={is_unlocked ? {
        backgroundImage: `url(${tag == "first_login" ? imgFirstLogin : tag == "first_collectible" ? imgFirstCollectible : imgThreeNewCollectibles}`,
      } : {}}></div>
      <div className="oyk-achievements-card-wrap">
        {period !== "one-time" && (
          <OykChip color="primary" className="oyk-achievements-card-period">
            {t(period).toUpperCase()}
          </OykChip>
        )}
        <div className="oyk-achievements-card-content">
          <div className="oyk-achievements-card-image">
            {is_unlocked ? (
              <img
                src={
                  tag == "first_login"
                    ? imgFirstLogin
                    : tag == "first_collectible"
                      ? imgFirstCollectible
                      : imgThreeNewCollectibles
                }
                alt=""
              />
            ) : (
              <Lock size={64} color="rgba(255, 255, 255, 0.3)" />
            )}
          </div>
          <div className="oyk-achievements-card-info">
            <h4>{t(title)}</h4>
            <p>{t(description)}</p>
          </div>
          <footer className="oyk-achievements-card-footer">
            <OykProgress progress={progress} goal={goal} />
          </footer>
        </div>
      </div>
    </article>
  );
}
