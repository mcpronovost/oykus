import { UserX } from "lucide-react";

import { useTranslation } from "@/services/translation";
import { oykTimeAgo } from "@/utils/formatters";
import { OykAlert, OykAvatar, OykButton } from "@/components/ui";

export default function FriendsRequestsCard({
  data,
  isRequest = false,
  hasError = null,
  onAccept = () => {},
  onReject = () => {},
  onCancel = () => {}
}) {
  const { t, lang } = useTranslation();

  if (!data) return null;

  return (
    <li className="oyk-settings-friends-requests-list-item">
      <div className="oyk-settings-friends-requests-list-item-identity">
        <OykAvatar src={data.avatar} name={data.name} abbr={data.abbr} size={56} />
        <div className="oyk-settings-friends-requests-list-item-identity-info">
          <span className="oyk-settings-friends-requests-list-item-identity-info-name">{data.name}</span>
          <span className="oyk-settings-friends-requests-list-item-identity-info-date">
            {oykTimeAgo(data.requested_at, lang)}
          </span>
        </div>
      </div>
      <div className="oyk-settings-friends-requests-list-item-actions">
        {isRequest ? (
          <>
            <OykButton color="primary" onClick={() => onAccept("accept", data.slug)}>{t("Accept")}</OykButton>
            <OykButton outline color="danger" icon={UserX} onClick={() => onReject("reject", data.slug)} />
          </>
        ) : (
          <>
            <OykButton outline color="danger" onClick={() => onCancel("cancel", data.slug)}>
              {t("Cancel")}
            </OykButton>
          </>
        )}
      </div>
      {hasError ? <OykAlert variant="danger" title={t("An error occurred")} message={hasError} /> : null}
    </li>
  );
}
